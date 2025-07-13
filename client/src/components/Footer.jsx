import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import the Link component

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-6 text-center">
        
        {/* --- 2. ADDED THIS NEW SECTION FOR LEGAL LINKS --- */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/our-process" className="text-sm text-gray-300 hover:text-white">Our Process</Link>
          <Link to="/about-us" className="text-sm text-gray-300 hover:text-white">About Us</Link>
          <Link to="/terms-of-service" className="text-sm text-gray-300 hover:text-white">Terms of Service</Link>
          <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-white">Privacy Policy</Link>
        </div>

        <p className="text-sm">&copy; {new Date().getFullYear()} Maternity Matters. All rights reserved.</p>
        <p className="text-xs mt-1 text-gray-400">
          Disclaimer: This portal provides a platform for grievance registration. Legal advice and actions are facilitated by independent legal professionals.
        </p>
      </div>
    </footer>
  );
};

export default Footer;