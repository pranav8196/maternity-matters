import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
      setError('Invalid or missing password reset token in URL.');
      setMessage(''); // Clear any success message
    }
  }, [location.search]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
        setError('Reset token is missing. Please use the link from your email again.');
        return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed. The link may have expired or been used already.');
      }
      setMessage('Password reset successful! You can now log in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Reset Your Password</h2>
        {message && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
        
        {!token && !error && <p className="text-center text-yellow-600">Loading token...</p>}

        {token && !message && ( // Only show form if token is present and no success message
            <form onSubmit={handleReset} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reset-new-password">New Password</label>
                <input
                id="reset-new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
            >
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            </form>
        )}
        
        {(!message || error) && ( // Show login link if no success message or if there's an error
            <p className="text-center text-sm text-gray-600 mt-8">
            Go back to{' '}
            <button onClick={() => navigate('/login')} className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Login
            </button>
            </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
