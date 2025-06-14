import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner'; // <<< 1. IMPORT SPINNER

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage('');
    setModalType('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/request-reset`, { email });
      setModalMessage(response.data.message || 'If an account with that email exists, a password reset link has been sent.');
      setModalType('success');
      setEmail(''); // Clear email field on success
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Failed to request password reset. Please try again.';
      setModalMessage(errorMsg);
      setModalType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal message={modalMessage} type={modalType} onClose={() => setModalMessage('')} title={modalType === 'error' ? "Error" : "Password Reset Request"}/>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 animate-fade-in">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Forgot Your Password?</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            No worries! Enter your email address below, and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email-request-reset" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email-request-reset"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* --- 2. UPDATED BUTTON WITH SPINNER --- */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Sending Link...</span>
                </>
              ) : 'Send Password Reset Link'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-8">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
       <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </>
  );
};

export default RequestPasswordResetPage;