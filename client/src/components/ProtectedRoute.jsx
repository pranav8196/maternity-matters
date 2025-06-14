import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optional: Show a loading spinner while checking auth status
    return <div className="flex justify-center items-center h-screen"><p>Loading authentication status...</p></div>;
  }

  if (!currentUser) {
    // User not authenticated, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // User is authenticated, render the children components
};

export default ProtectedRoute;