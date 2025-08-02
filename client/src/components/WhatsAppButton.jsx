// File: client/src/components/WhatsAppButton.jsx

import React from 'react';

// --- UPDATED, CLEANER SVG ICON FOR WHATSAPP ---
const WhatsAppIcon = () => (
    <svg 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-8 h-8 text-white" 
        fill="currentColor"
    >
        <path d="M16,2A13.9,13.9,0,0,0,2,16C2,23.4,6.8,29.3,13.5,30.9V29.1A12.1,12.1,0,0,1,3.8,16a12.2,12.2,0,0,1,20.7-9.2,12.2,12.2,0,0,1-1.3,21.5A12,12,0,0,1,16,28.1h0a12.1,12.1,0,0,1-8.5-3.5l-1.1-1.1L3.8,25.1,5.4,22a12.2,12.2,0,0,1-1.6-6,12.2,12.2,0,0,1,12.2-12.2M16,0A16,16,0,0,0,0,16c0,8.8,7.2,16,16,16a15.9,15.9,0,0,0,10.2-3.7l6.2,2.3-2.5-6A16,16,0,0,0,16,0Z"/>
        <path d="M22.5,18.5c-.2-.1-1.3-.6-1.5-.7s-.4-.1-.6.1-.6.7-.7.8-.3.2-.5,0a6.6,6.6,0,0,1-2.4-1.5,7.1,7.1,0,0,1-1.7-2.1.1.1,0,0,1,0-.1c.1-.1.2-.3.4-.4a1.2,1.2,0,0,0,.3-.5.9.9,0,0,0,0-.5,1.6,1.6,0,0,0-.5-1.1c-.1-.1-.3-.3-.4-.4s-.3-.2-.5-.2h-.4a1,1,0,0,0-.7.3,3.1,3.1,0,0,0-1,2.4,5.4,5.4,0,0,0,1.2,4,10.9,10.9,0,0,0,4.6,4,8.5,8.5,0,0,0,2.9,1.3,3.9,3.9,0,0,0,1.8-.1,3.2,3.2,0,0,0,2.1-1.8.8.8,0,0,0,.1-.8c-.1-.1-.4-.2-.6-.3Z"/>
    </svg>
);


const WhatsAppButton = () => {
  const phoneNumber = "918600900078";
  const message = encodeURIComponent("Hello! I have a question about my maternity rights.");
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-24 sm:right-28 bg-green-500 h-16 w-16 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-600 transform hover:scale-110 transition-all duration-200 ease-in-out z-50"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
};

export default WhatsAppButton;