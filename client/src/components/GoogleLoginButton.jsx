import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const GoogleLoginButton = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleGoogleSuccess = async (credentialResponse) => {
    const toastId = toast.loading('Signing in with Google...');
    try {
      const idToken = credentialResponse.credential;
      const response = await axios.post(`${API_BASE_URL}/auth/google-login`, { idToken });
      const { token, userId, email } = response.data;
      
      // Store the session details
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);

      toast.success('Logged in successfully! Redirecting...', { id: toastId });
      
      // The most reliable way to ensure the entire app recognizes the new login state
      // is to do a full page navigation.
      window.location.href = from;

    } catch (error) {
      const errorMsg = error.response?.data?.error || "Google Sign-In failed. Please try again.";
      toast.error(errorMsg, { id: toastId });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In failed. Please ensure pop-ups are enabled.");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        theme="filled_blue"
        shape="rectangular"
        width="364px" // Match the width of a typical form input
      />
    </div>
  );
};

export default GoogleLoginButton;