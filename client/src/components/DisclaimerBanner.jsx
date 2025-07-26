// File: client/src/components/DisclaimerBanner.jsx

import React from 'react';

const DisclaimerBanner = ({ onAccept, onDecline }) => {
  return (
    // This div is fixed to the bottom of the screen with a high z-index to appear on top
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50 animate-fade-in-up">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-300 max-w-4xl">
          <h3 className="font-bold text-white mb-1">Disclaimer</h3>
          <p>
            The information provided under this website is for informational purposes only and should not be interpreted as soliciting or advertisement. By clicking on "Accept", you acknowledge that, there has been no advertisement, solicitation, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website.
          </p>
        </div>
        <div className="flex-shrink-0 flex gap-3">
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
       {/* We can add the animation keyframes here or in a global CSS file */}
       <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default DisclaimerBanner;