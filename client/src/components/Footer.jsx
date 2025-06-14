import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-6 text-center">
        {/* Changed "Maternity Justice Portal" to "Maternity Matters" and made the year dynamic */}
        <p className="text-sm">&copy; {new Date().getFullYear()} Maternity Matters. All rights reserved.</p>
        <p className="text-xs mt-1">
          Disclaimer: This portal provides a platform for grievance registration. Legal advice and actions are facilitated by independent legal professionals.
        </p>
      </div>
    </footer>
  );
};

export default Footer;