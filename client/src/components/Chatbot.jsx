import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// --- SVG Icons for the Chatbot ---
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-brand-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'ai', text: "Hello! I am MaatriNyay, an AI assistant from Maternity Matters. How can I help you understand your rights under the Indian Maternity Benefit Act?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Automatically scroll to the bottom when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        // Add user message to chat
        setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Send message to backend API
            const response = await axios.post(`${API_BASE_URL}/ai/chat`, { message: userMessage });
            const aiReply = response.data.reply;

            // Add AI reply to chat
            setMessages(prev => [...prev, { from: 'ai', text: aiReply }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorReply = "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
            setMessages(prev => [...prev, { from: 'ai', text: errorReply, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-8 w-full max-w-sm h-[60vh] sm:h-[70vh] bg-white rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-heading font-bold text-lg text-brand-headings">Chat with MaatriNyay</h3>
                    <button onClick={() => setIsOpen(false)}><CloseIcon /></button>
                </div>

                {/* Message Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-brand-secondary/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex my-2 ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.from === 'ai' ? 'bg-white shadow-sm' : 'bg-brand-primary text-white'} ${msg.isError ? 'bg-red-500 text-white' : ''}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex my-2 justify-start">
                             <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-xl bg-white shadow-sm">
                                <p className="text-sm text-gray-500 italic">MaatriNyay is typing...</p>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-xl">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors"
                            disabled={isLoading}
                        />
                        <button type="submit" className="ml-3 p-2 bg-brand-primary text-white rounded-full hover:bg-brand-primary-hover disabled:bg-gray-400" disabled={isLoading || !inputValue}>
                            <SendIcon />
                        </button>
                    </div>
                </form>
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-4 sm:right-8 bg-brand-primary h-16 w-16 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-brand-primary-hover transform hover:scale-110 transition-all duration-200 ease-in-out z-50"
                aria-label="Toggle Chat"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </>
    );
};

export default Chatbot;