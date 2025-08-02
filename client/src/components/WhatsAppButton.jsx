// File: client/src/components/WhatsAppButton.jsx

import React from 'react';

// --- YOUR NEW CUSTOM WHATSAPP ICON ---
// I've taken the SVG code you provided and turned it into a React component.
const CustomWhatsAppIcon = () => (
    <svg width="36" height="36" viewBox="0 0 75 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1_2)">
            <path d="M1.60357 37.5452C1.60181 43.9306 3.26105 50.1656 6.41605 55.6612L1.30184 74.4379L20.4111 69.3995C25.6965 72.2928 31.6184 73.8088 37.6362 73.8093H37.652C57.518 73.8093 73.6894 57.5538 73.6979 37.5737C73.7017 27.892 69.9555 18.7879 63.1493 11.9385C56.3442 5.08964 47.2937 1.31586 37.6506 1.31144C17.7823 1.31144 1.61207 17.566 1.60386 37.5452" fill="url(#paint0_linear_1_2)"/>
            <path d="M0.3165 37.5334C0.314449 44.1486 2.03315 50.6066 5.30064 56.2989L0.00304985 75.7487L19.7975 70.5298C25.2516 73.52 31.3923 75.0965 37.6407 75.0989H37.6568C58.2355 75.0989 74.9878 58.2587 74.9966 37.5634C75.0001 27.5338 71.1192 18.1024 64.0698 11.0076C57.0195 3.91371 47.6453 0.00412403 37.6568 0C17.0746 0 0.324702 16.8378 0.3165 37.5334ZM12.1048 55.3186L11.3657 54.1388C8.25879 49.1711 6.61889 43.4305 6.62123 37.5358C6.62768 20.3341 20.5495 6.33923 37.6686 6.33923C45.9589 6.34276 53.75 9.5925 59.61 15.4887C65.4698 21.3855 68.6942 29.2241 68.6922 37.5611C68.6846 54.7627 54.7624 68.7594 37.6568 68.7594H37.6445C32.0748 68.7564 26.6123 67.2523 21.8484 64.41L20.7147 63.734L8.9683 66.8308L12.1048 55.3186Z" fill="url(#paint1_linear_1_2)"/>
            <path d="M28.3244 21.842C27.6255 20.2799 26.8899 20.2484 26.2252 20.221C25.6809 20.1974 25.0587 20.1992 24.4371 20.1992C23.8148 20.1992 22.8039 20.4346 21.9494 21.3728C21.094 22.3119 18.6836 24.5813 18.6836 29.197C18.6836 33.8126 22.027 38.2737 22.4931 38.9002C22.9597 39.5256 28.9475 49.3007 38.4307 53.0613C46.312 56.1864 47.9159 55.5648 49.6264 55.4081C51.3372 55.252 55.1466 53.1393 55.9238 50.9486C56.7016 48.7581 56.7016 46.8805 56.4684 46.4881C56.2352 46.0972 55.613 45.8625 54.68 45.3935C53.7469 44.9245 49.1597 42.6546 48.3046 42.3414C47.4492 42.0286 46.8273 41.8725 46.2051 42.8119C45.5829 43.7498 43.7962 45.8625 43.2517 46.4881C42.7077 47.1153 42.1631 47.1933 41.2303 46.7241C40.2967 46.2534 37.292 45.2639 33.7272 42.0681C30.9536 39.5813 29.0811 36.5103 28.5368 35.5709C27.9925 34.633 28.4785 34.1246 28.9463 33.6571C29.3655 33.2367 29.8797 32.5616 30.3466 32.014C30.8118 31.4661 30.9671 31.0752 31.2782 30.4495C31.5896 29.8232 31.4337 29.2753 31.2008 28.8061C30.9671 28.3368 29.154 23.697 28.3244 21.842Z" fill="white"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="3621.1" y1="7313.96" x2="3621.1" y2="1.31144" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1FAF38"/>
                <stop offset="1" stopColor="#60D669"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="3749.68" y1="7574.87" x2="3749.68" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F9F9F9"/>
                <stop offset="1" stopColor="white"/>
            </linearGradient>
            <clipPath id="clip0_1_2">
                <rect width="75" height="76" fill="white"/>
            </clipPath>
        </defs>
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
      className="fixed bottom-6 right-24 sm:right-28 bg-white p-2 h-16 w-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 ease-in-out z-50"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <CustomWhatsAppIcon />
    </a>
  );
};

export default WhatsAppButton;