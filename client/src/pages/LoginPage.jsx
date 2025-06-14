import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner'; // <<< 1. IMPORT THE NEW SPINNER COMPONENT

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // <<< 2. USE THE LOGIN FUNCTION FROM AUTHCONTEXT
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation is now handled declaratively by App.jsx
    } catch (err) {
      const errorMessage = err.error || err.errors?.map(er => er.msg).join(', ') || err.message || 'Login failed. Please check your credentials.';
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* This modal is available for broader notifications if needed in the future */}
      {/* <Modal message={modalMessage} type={modalType} onClose={() => setModalMessage('')} title={"Login Status"}/> */}
      <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
              <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Welcome Back</h2>
              {formError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{formError}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">Email Address</label>
                      <input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="you@example.com"
                          autoComplete="email"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">Password</label>
                      <input
                          id="login-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                          autoComplete="current-password"
                      />
                  </div>
                  <div className="flex items-center justify-end">
                      <Link to="/request-password-reset" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Forgot your password?
                      </Link>
                  </div>

                  {/* --- 3. UPDATED BUTTON USING SPINNER COMPONENT --- */}
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                  >
                      {isLoading ? (
                        <>
                          <Spinner />
                          <span>Logging in...</span>
                        </>
                      ) : (
                        'Login'
                      )}
                  </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-8">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      Register here
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

export default LoginPage;