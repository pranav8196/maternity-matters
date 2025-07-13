const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// --- Configuration ---
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error("ERROR: GOOGLE_GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// --- Knowledge Base ---
const knowledgeBase = `
    Knowledge Base: Maternity Benefit Act, India (2024 Update)

    1. Overview: The Maternity Benefit Act, 1961, governs the employment of women in establishments before and after childbirth and provides maternity benefits. The Act applies to establishments employing 10 or more persons.
    2. Applicability: Applicable to factories, mines, plantations, and establishments (including government establishments) where 10 or more employees are working. Applies to both private and public sector companies.
    3. Maternity Leave Duration: 26 weeks of paid leave for the first two children. 12 weeks of paid leave for the third child onwards.
    4. Eligibility Criteria: The woman must have worked in the establishment for at least 80 days in the 12 months preceding the expected delivery date.
    5. Payment of Maternity Benefit: Paid at the rate of the average daily wage for the period of actual absence. Wages include basic pay, dearness allowance, and other cash allowances.
    6. Additional Benefits and Rights: No dismissal or discharge during maternity leave. No change in employment terms during the maternity leave period. Employer must not assign arduous tasks or work involving long hours during the 10 weeks before and after delivery.
    7. Crèche Facility: Mandatory for establishments with 50 or more employees. Crèche should be within a prescribed distance. Four visits allowed by the woman to the crèche in a day, including rest intervals.
    8. Work from Home Provision: Employers may allow work-from-home post-maternity leave depending on the nature of work and mutual agreement.
    9. Penalties for Non-Compliance: Employers violating the Act may face imprisonment up to 1 year and/or a fine up to Rs. 5,000. While the monetary fine is currently low, employers often respond to legal notices due to the reputational risk, potential litigation, and media or employee backlash associated with non-compliance.
    10. Filing a Legal Complaint: Our platform helps you consult and strategize at a lower cost than traditional legal channels. This can be the first step to assert your rights if maternity benefits are denied. If your employer still does not comply after receiving the legal notice, we also provide further legal assistance, for eligible cases subject to verification of facts, supporting documents, and legal merit.
    11. Employer Obligations: Display notice in the workplace about the rights under the Maternity Benefit Act. Maintain records and registers of women employees and their maternity status.
    12. Clarifications: Paid leave is separate from earned or sick leave. Maternity leave cannot be denied once eligibility is met.
`;

// --- System Prompts (Corrected Logic) ---

// 1. A detailed prompt for the VERY FIRST user message in a conversation.
const firstTimeSystemPrompt = `
    You are 'MaatriNyay', a supportive and empathetic AI assistant for the Maternity Matters portal in India. Your primary goal is to help working women understand their maternity rights based ONLY on the provided knowledge base.

    **Your Personality & Rules:**
    1.  **Disclaimer & Empathetic Opening:** Always start your first response by introducing yourself and giving a short disclaimer. For example: "Hello! I am MaatriNyay, an AI assistant designed to help with common questions about maternity rights in India. Please note that I am not a legal advisor. How can I help you today?"
    2.  **Strictly Fact-Based:** You MUST base your answers strictly on the provided Knowledge Base text. Do not use any external information or make up answers.
    3.  **Do Not Give Legal Advice:** Never say "you should do this," "your case is strong," or give any kind of legal advice. State the facts from the knowledge base. If asked for advice on what to do, gently guide them to file a complaint on the portal by saying something like, "For specific guidance on your situation, the best first step is to file a complaint so our legal team can review your details."
    4.  **Handle Unknown Questions:** If a question cannot be answered from the Knowledge Base, respond politely with: "I'm sorry, I don't have information on that specific topic. For detailed queries related to your personal case, I recommend filing a complaint to get assistance from our legal professionals."
    5.  **Keep it Simple:** Explain things in clear, simple language. Use bullet points if it helps with clarity.
    6.  **Outside Domain:** If a user's question is not related to maternity rights in India, please mention that the question is outside your area of expertise. For example: "My purpose is to assist with questions about maternity benefits in India, so I can't help with that particular topic."
    7.  **Crucially, do not mention that you are using a knowledge base in your response.** Act as if this is your own knowledge.
`;

// 2. A much shorter prompt for FOLLOW-UP messages.
const followUpSystemPrompt = `
    You are 'MaatriNyay', an AI assistant for Maternity Matters. Continue the conversation based on the user's new message and the provided knowledge base.
    
    **Your Rules:**
    - Start your response with a short, supportive phrase (e.g., "That's a good question...", "I can clarify that for you...").
    - Answer ONLY from the knowledge base.
    - Do NOT give legal advice. Guide them to file a complaint for specific guidance.
    - Do NOT mention the knowledge base.
    - If you don't know the answer, say so politely and suggest filing a complaint.
    - If the topic is outside maternity rights, state that it's outside your purview.
`;


// --- API Route (Updated Logic) ---
router.post('/chat', 
    [ body('messages').isArray({ min: 1 }).withMessage('Messages must be a non-empty array.') ], 
    async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const incomingMessages = req.body.messages;

    try {
        // The first message from the frontend is the AI's greeting. 
        // We slice from the second item (index 1) to ensure the history starts with the user's first question.
        const historyForApi = incomingMessages.slice(1).map(msg => ({
            role: msg.from === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // If historyForApi has only one message, it's the user's first question.
        const isFirstUserMessage = historyForApi.length <= 1;
        
        const systemInstruction = isFirstUserMessage ? firstTimeSystemPrompt : followUpSystemPrompt;
        
        // The last message in the history is the current question we need to answer.
        const lastMessage = historyForApi.length > 0 ? historyForApi.pop().parts[0].text : "";

        // Now, historyForApi contains all turns *before* the current question.
        const chat = model.startChat({
            history: historyForApi
        });
        
        const promptForThisTurn = `${systemInstruction}\n\n--- KNOWLEDGE BASE ---\n${knowledgeBase}\n\n--- CURRENT QUESTION ---\n${lastMessage}`;

        const result = await chat.sendMessage(promptForThisTurn);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("AI CHAT ERROR:", error);
        res.status(500).json({ error: "Sorry, I'm having trouble responding right now. Please try again later." });
    }
});


module.exports = router;