// File: client/src/components/WhatsAppButton.jsx

import React from 'react';

// SVG Icon for WhatsApp
const WhatsAppIcon = () => (
  <svg
    height="32px"
    width="32px"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M108.3,21.5A54.4,54.4,0,0,0,32.5,91.8L19.7,108.3,37.1,95.2a54.2,54.2,0,0,0,27.1,7.1h0A54.4,54.4,0,0,0,108.3,21.5Z"
      fill="#eceff1"
    />
    <path
      d="M64.2,104.4h0a52.4,52.4,0,0,1-26.6-7L20.4,108.3l11-16.7a52.2,52.2,0,0,1-7.9-27.4,52.4,52.4,0,0,1,81.4-36.7,52.4,52.4,0,0,1-22.1,86.9Z"
      fill="#4caf50"
    />
    <path
      d="M82.1,73.3c-.4-.2-2.3-1.1-2.6-1.2s-1.8-.2-2.5.2-1,1.2-1.2,1.5-.4.3-.8.1-1.6-.6-3-1.8-2.2-2-3.1-3.3.3-.5.6-.7a1,1,0,0,0,.1-.7,8.8,8.8,0,0,0-1.2-2.6c-.3-.3-1.5-1.8-2-2.3s-1-.5-1.4-.5h-1a2.2,2.2,0,0,0-1.6,2.3,9.5,9.5,0,0,0,2.1,5.1,19.4,19.4,0,0,0,8.1,7.2,15.2,15.2,0,0,0,5.2,2.3,4.6,4.6,0,0,0,3.3-1.1,4.2,4.2,0,0,0,1.2-3.2c-.1-.4-.4-1.1-.8-1.3s-.9-.2-1.3-.4Z"
      fill="#fff"
    />
  </svg>
);


const WhatsAppButton = () => {
  // The phone number with the country code (91 for India)
  const phoneNumber = "918600900078";
  // You can customize the pre-filled message here
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