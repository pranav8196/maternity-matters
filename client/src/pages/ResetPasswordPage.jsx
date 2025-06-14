import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner'; // <<< 1. IMPORT SPINNER

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
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
      setModalMessage('Invalid or missing password reset token in URL. Please use the link from your email.');
      setModalType('error');
    }
  }, [location.search]);

  const handleReset = async (e) => {
    e.preventDefault();
    setFormError('');
    setModalMessage('');

    if (!token) {
        setModalMessage('Reset token is missing. Please request a new reset link.');
        setModalType('error');
        return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
      setModalMessage(response.data.message || 'Password reset successful! You can now log in.');
      setModalType('success');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setModalMessage('');
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Password reset failed. The link may be invalid or expired.';
      setModalMessage(errorMsg);
      setModalType('error');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Modal message={modalMessage} type={modalType} onClose={() => setModalMessage('')} title={modalType === 'error' ? "Error" : "Password Reset"}/>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 animate-fade-in">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Set New Password</h2>
          {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{formError}</p>}
          
          {token && !modalMessage.includes('successful') && (
              <form onSubmit={handleReset} className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reset-new-password">New Password</label>
                  <input
                  id="reset-new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError.includes('Password must be') ? 'border-red-500' : 'border-gray-300'}`}
                  required
                  autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reset-confirm-password">Confirm New Password</label>
                  <input
                  id="reset-confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError.includes('match') ? 'border-red-500' : 'border-gray-300'}`}
                  required
                  autoComplete="new-password"
                  />
              </div>
              
              {/* --- 2. UPDATED BUTTON WITH SPINNER --- */}
              <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
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
          
          <p className="text-center text-sm text-gray-600 mt-8">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
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