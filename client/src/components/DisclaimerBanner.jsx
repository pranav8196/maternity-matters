// File: client/src/components/DisclaimerBanner.jsx

import React from 'react';

const DisclaimerBanner = ({ onAccept, onDecline }) => {
  return (
    // This is the full-screen semi-transparent overlay
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      
      {/* This is the white modal box in the center */}
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-2xl w-full text-brand-text transform transition-all animate-scale-up">
        
        <h2 className="text-2xl font-heading font-bold text-brand-headings mb-4">Disclaimer</h2>
        
        <div className="text-sm max-h-[50vh] overflow-y-auto pr-2">
          <p className="mb-4">
            The information provided under this website is for informational purposes only and should not be interpreted as soliciting or advertisement.
          </p>
          <p>
            By clicking on "Accept", you acknowledge that, there has been no advertisement, solicitation, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website.
          </p>
        </div>

        {/* --- THIS IS THE CORRECTED BUTTON ORDER --- */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onAccept}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default DisclaimerBanner;