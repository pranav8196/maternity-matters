// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Or direct axios call
import Modal from '../components/Modal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const navigate = useNavigate();
  // const { register } = useAuth(); // If register function is in AuthContext

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setModalMessage('');
    setModalType('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Using axios directly here for register, as AuthContext's register might not handle this specific flow
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.errors?.map(e => e.msg).join(', ') || 'Registration failed.';
        throw new Error(errorMessage);
      }
      
      setModalMessage(data.message || 'Registration request successful! Please check your email to activate your account.');
      setModalType('success');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Don't navigate to login immediately, user needs to activate.
      // setTimeout(() => {
      //   setModalMessage(''); 
      // }, 5000); // Keep message for a bit

    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal message={modalMessage} type={modalType} onClose={() => setModalMessage('')} title={modalType === 'error' ? "Registration Failed" : "Registration Status"}/>
      <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
              <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Create Your Account</h2>
              {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{formError}</p>}
              <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-email">Email Address</label>
                      <input
                          id="register-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError.includes('email') ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="you@example.com"
                          autoComplete="email"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-password">Password</label>
                      <input
                          id="register-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError.includes('password') ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                          autoComplete="new-password"
                      />
                       <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters.</p>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-confirm-password">Confirm Password</label>
                      <input
                          id="register-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError.includes('match') ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                          autoComplete="new-password"
                      />
                  </div>
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
                  >
                      {isLoading ? 'Registering...' : 'Register'}
                  </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-8">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      Login here
                  </Link>
              </p>
          </div>
      </div>
    </>
  );
};

export default RegisterPage;