import React from 'react';

// This is a more robust Modal component.
const Modal = ({ title = "Notification", message, type = "info", onClose, children }) => {
  // 1. A strong guard: If there's no message AND no children to display, don't render anything.
  if (!message && !children) {
    return null;
  }

  // 2. Stop event propagation to prevent clicks inside the modal from closing it.
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // --- Style definitions based on type ---
  let bgColor, borderColor, textColor, buttonColor, buttonHoverColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-100'; borderColor = 'border-green-400'; textColor = 'text-green-700';
      buttonColor = 'bg-green-500'; buttonHoverColor = 'hover:bg-green-700';
      icon = <svg className="h-6 w-6 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
      break;
    case 'error':
      bgColor = 'bg-red-100'; borderColor = 'border-red-400'; textColor = 'text-red-700';
      buttonColor = 'bg-red-500'; buttonHoverColor = 'hover:bg-red-700';
      icon = <svg className="h-6 w-6 text-red-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      break;
    default: // info
      bgColor = 'bg-blue-100'; borderColor = 'border-blue-400'; textColor = 'text-blue-700';
      buttonColor = 'bg-blue-500'; buttonHoverColor = 'hover:bg-blue-700';
      icon = <svg className="h-6 w-6 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }


  return (
    // 3. The dark overlay. Clicking it will now close the modal.
    <div 
      className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-center p-4"
      onClick={onClose} 
    >
      <div 
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col ${bgColor}`}
        onClick={handleModalContentClick} // Prevents closing when clicking inside the modal content
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-center">
          {icon}
          {message && <p className={`text-sm ${textColor}`}>{message}</p>}
          {children}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className={`px-6 py-2 ${buttonColor} ${buttonHoverColor} text-white text-sm font-medium rounded-md shadow-sm`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;