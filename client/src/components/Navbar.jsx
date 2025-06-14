import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Verify this path is correct

// Simple SVG Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const DocumentPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>;
const ArrowLeftOnRectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center">
        {/* --- THIS IS THE CHANGED LINE --- */}
        <Link to={currentUser ? "/dashboard" : "/"} className="text-xl sm:text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Maternity Matters
        </Link>
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 mt-2 sm:mt-0">
          {currentUser ? (
            <>
              {currentUser.email && <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">Welcome, {currentUser.email}!</span>}
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center"> <HomeIcon />Dashboard</Link>
              <Link to="/new-complaint" className="text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center"> <DocumentPlusIcon />File Complaint</Link>
              <Link to="/complaints" className="text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center"> <ListBulletIcon />My Complaints</Link>
              <button onClick={handleLogout} className="bg-pink-500 hover:bg-pink-600 text-white px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center"> <ArrowLeftOnRectangleIcon />Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md text-xs sm:text-sm font-medium">Home</Link>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md text-xs sm:text-sm font-medium">Login</Link>
              <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;