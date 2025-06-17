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


// --- Knowledge Base & System Prompt ---
const knowledgeBase = `
    Knowledge Base: Maternity Benefit Act, India (2024 Update)

    1. Overview The Maternity Benefit Act, 1961, governs the employment of women in establishments before and after childbirth and provides maternity benefits. The Act applies to establishments employing 10 or more persons.
    2. Applicability - Applicable to factories, mines, plantations, and establishments (including government establishments) where 10 or more employees are working. - Applies to both private and public sector companies. - Also applies to contractual and consultant employees.
    3. Maternity Leave Duration - 26 weeks of paid leave for the first two children. - 12 weeks of paid leave for the third child onwards. - Out of the 26 weeks, up to 8 weeks can be availed before the expected delivery date. - For commissioning mothers (biological mothers using surrogacy), 12 weeks of leave from the date the child is handed over.
    4. Eligibility Criteria - The woman must have worked in the establishment for at least 80 days in the 12 months preceding the expected delivery date.
    5. Payment of Maternity Benefit - Paid at the rate of the average daily wage for the period of actual absence. - Wages include basic pay, dearness allowance, and other cash allowances.
    6. Additional Benefits and Rights - No dismissal or discharge during maternity leave. - No change in employment terms during the maternity leave period. - Employer must not assign arduous tasks or work involving long hours during the 10 weeks before and after delivery. - Woman has the right to rejoin in the same role/post after maternity leave.
    7. Crèche Facility - Mandatory for establishments with 50 or more employees. - Crèche should be within a prescribed distance. - Four visits allowed by the woman to the crèche in a day, including rest intervals.
    8. Work from Home Provision - Employers may allow work-from-home post-maternity leave depending on the nature of work and mutual agreement.
    9. Penalties for Non-Compliance - Employers violating the Act may face imprisonment up to 1 year and/or a fine up to Rs. 5,000. - ⚠️ While the monetary fine is currently low, employers often respond to legal notices due to the reputational risk, potential litigation, and media or employee backlash associated with non-compliance.
    10. Filing a Legal Complaint - Our platform drafts a legally sound notice very quickly and at a lower cost than traditional legal channels. This can be the first step to assert your rights if maternity benefits are denied. - If your employer still does not comply after receiving the legal notice, we also provide further legal assistance, including support in pursuing legal action, for eligible cases subject to verification of facts, supporting documents, and legal merit.
    11. Employer Obligations - Display notice in the workplace about the rights under the Maternity Benefit Act. - Maintain records and registers of women employees and their maternity status.
    12. Clarifications - Paid leave is separate from earned or sick leave. - Maternity leave cannot be denied once eligibility is met. - In case of miscarriage or medical termination of pregnancy, 6 weeks of leave is available. - In case of tubectomy operation, 2 weeks of leave is granted.
    13. How Our Platform Ensures Accountability Our service goes beyond just sending legal notices. We help ensure your complaint is taken seriously through: - A structured legal escalation system - Support for further legal action through verified legal partners 

`;

const systemPrompt = `
    You are 'MaatriNyay', a supportive and empathetic AI assistant for the Maternity Matters portal in India. Your primary goal is to help working women understand their maternity rights based ONLY on the provided knowledge base.

    **Your Personality & Rules:**
    1.  **Empathetic Opening:** Always start your response with a short, supportive, and reassuring phrase. Examples: "I understand this can be a confusing time, let me clarify that for you...", "That's a very important question, and it's good you're asking...", "I'm here to help you understand your rights."
    2.  **Strictly Fact-Based:** You MUST base your answers strictly on the provided Knowledge Base text. Do not use any external information or make up answers.
    3.  **Do Not Give Legal Advice:** Never say "you should do this," "your case is strong," or give any kind of legal advice. State the facts from the knowledge base. If asked for advice on what to do, gently guide them to file a complaint on the portal by saying something like, "For specific guidance on your situation, the best first step is to file a complaint so our legal team can review your details."
    4.  **Handle Unknown Questions:** If the user's question cannot be answered from the Knowledge Base, respond politely with: "I'm sorry, I don't have information on that specific topic. For detailed queries related to your personal case, I recommend filing a complaint to get assistance from our legal professionals."
    5.  **Keep it Simple:** Explain things in clear, simple language. Use bullet points if it helps with clarity.
    6.  **Disclaimer: At start while introducing yourself , give a short disclaimer that you are a chatbot which provides assistance with common maternity related doubts, not a legal advisor.
    7.  **Outside Domain: If user's question is not related to maternity in India, please mention that this question is not in your purview.
    8.  **Crucially, do not mention that you are using a knowledge base in your response.** Act as if this is your own knowledge. For example, instead of saying 'Based on the knowledge base...', just state the fact directly.
`;


// --- API Route ---
router.post('/chat', 
    [ body('message').notEmpty().withMessage('Message cannot be empty.').trim().escape() ], 
    async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userMessage = req.body.message;

    try {
        const prompt = `${systemPrompt}\n\n--- KNOWLEDGE BASE ---\n${knowledgeBase}\n\n--- USER'S QUESTION ---\n${userMessage}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("AI CHAT ERROR:", error);
        res.status(500).json({ error: "Sorry, I'm having trouble responding right now. Please try again later." });
    }
});


module.exports = router;