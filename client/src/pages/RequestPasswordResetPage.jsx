import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // Using toast instead of Modal
import Spinner from '../components/Spinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Sending reset link...');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/request-reset`, { email });
      
      toast.success(response.data.message || 'If an account with that email exists, a password reset link has been sent.', {
        id: toastId,
        duration: 5000,
      });

      setEmail(''); // Clear email field on success
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Failed to request password reset.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 animate-fade-in">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
          {/* --- MODIFIED LINE: Updated font and color --- */}
          <h2 className="text-3xl font-heading font-bold text-center text-brand-headings mb-6">Forgot Your Password?</h2>
          <p className="text-center text-sm text-brand-text mb-6">
            No worries! Enter your email address below, and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {/* --- MODIFIED LINE: Updated text color --- */}
              <label htmlFor="email-request-reset" className="block text-sm font-medium text-brand-text mb-1">
                Email Address
              </label>
              <input
                id="email-request-reset"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // --- MODIFIED LINE: Updated focus colors ---
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* --- MODIFIED LINE: Updated button colors --- */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Sending Link...</span>
                </>
              ) : 'Send Password Reset Link'}
            </button>
          </form>
          <p className="text-center text-sm text-brand-text mt-8">
            Remembered your password?{' '}
            {/* --- MODIFIED LINE: Updated link colors --- */}
            <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
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