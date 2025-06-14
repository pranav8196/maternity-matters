// client/src/pages/AccountActivationPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AccountActivationPage = () => {
  const [message, setMessage] = useState('Activating your account, please wait...');
  const [statusType, setStatusType] = useState('info'); // 'info', 'success', 'error'
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      const activateAccount = async () => {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/activate-account`, { token });
          setMessage(response.data.message || 'Account activated successfully! Redirecting to login...');
          setStatusType('success');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Account activation failed. The link may be invalid or expired. Please try registering again.';
          setMessage(errorMsg);
          setStatusType('error');
        }
      };
      activateAccount();
    } else {
      setMessage('Invalid activation link. No token found.');
      setStatusType('error');
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Account Activation</h2>
        {statusType === 'info' && (
            <div className="flex justify-center items-center my-4">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )}
        <p className={`text-lg ${statusType === 'success' ? 'text-green-600' : statusType === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
          {message}
        </p>
        {(statusType === 'success' || statusType === 'error') && (
          <div className="mt-8">
            <Link 
              to="/login" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
         {statusType === 'error' && !location.search.includes('token=') && (
            <div className="mt-4">
                <p className="text-sm text-gray-500">If you haven't registered yet:</p>
                <Link 
                to="/register" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                Register Here
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default AccountActivationPage;
