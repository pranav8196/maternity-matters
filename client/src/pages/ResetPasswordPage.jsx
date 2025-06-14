import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
    } else {
      toast.error('Invalid or missing password reset token in URL.');
      setFormError('Invalid or missing password reset token in URL.');
    }
  }, [location.search]);

  const handleReset = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!token) {
      toast.error('Reset token is missing. Please use the link from your email.');
      setFormError('Reset token is missing. Please use the link from your email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      setFormError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading('Resetting your password...');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
      
      toast.success(response.data.message || 'Password reset successful!', {
        id: toastId,
        duration: 4000,
      });

      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Password reset failed.';
      toast.error(errorMsg, {
        id: toastId,
      });
      setFormError(errorMsg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 animate-fade-in">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-heading font-bold text-center text-brand-headings mb-8">Set New Password</h2>
          {formError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                  <span className="block sm:inline">{formError}</span>
              </div>
          )}
          
          {token && (
              <form onSubmit={handleReset} className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="reset-new-password">New Password</label>
                  <input
                    id="reset-new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                    required
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="reset-confirm-password">Confirm New Password</label>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                    required
                    autoComplete="new-password"
                  />
              </div>
              
              <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span>Resetting...</span>
                    </>
                  ) : 'Reset Password'}
              </button>
              </form>
          )}
          
          <p className="text-center text-sm text-brand-text mt-8">
            <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
                Back to Login
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

export default ResetPasswordPage;