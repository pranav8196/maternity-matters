import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
      <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
              {/* --- MODIFIED LINE: Updated font and color --- */}
              <h2 className="text-3xl font-heading font-bold text-center text-brand-headings mb-8">Welcome Back</h2>
              {formError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{formError}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                      {/* --- MODIFIED LINE: Updated text color --- */}
                      <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="login-email">Email Address</label>
                      <input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          // --- MODIFIED LINE: Updated focus colors ---
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="you@example.com"
                          autoComplete="email"
                      />
                  </div>
                  <div>
                      {/* --- MODIFIED LINE: Updated text color --- */}
                      <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="login-password">Password</label>
                      <input
                          id="login-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          // --- MODIFIED LINE: Updated focus colors ---
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                          autoComplete="current-password"
                      />
                  </div>
                  <div className="flex items-center justify-end">
                      {/* --- MODIFIED LINE: Updated link colors --- */}
                      <Link to="/request-password-reset" className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover">
                          Forgot your password?
                      </Link>
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
                          <span>Logging in...</span>
                        </>
                      ) : (
                        'Login'
                      )}
                  </button>
              </form>
              <p className="text-center text-sm text-brand-text mt-8">
                  Don't have an account?{' '}
                  {/* --- MODIFIED LINE: Updated link colors --- */}
                  <Link to="/register" className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
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