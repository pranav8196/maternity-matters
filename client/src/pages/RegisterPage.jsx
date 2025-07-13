import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import GoogleLoginButton from '../components/GoogleLoginButton'; // <<< 1. IMPORT THE GOOGLE LOGIN BUTTON

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Submitting your registration...');

    try {
      const data = await register(email, password);
      
      toast.success(data.message || 'Registration request successful! Please check your email.', {
        id: toastId,
        duration: 6000,
      });

      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      const errorMessage = err.error || err.errors?.map(e => e.msg).join(', ') || err.message || 'Registration failed. Please try again.';
      setFormError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
              <h2 className="text-3xl font-heading font-bold text-center text-brand-headings mb-6">Create Your Account</h2>
              
              {/* --- 2. ADD THE GOOGLE LOGIN BUTTON HERE --- */}
              <div className="mb-6">
                <GoogleLoginButton />
              </div>

              {/* --- 3. ADD A VISUAL SEPARATOR --- */}
              <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {formError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{formError}</span>
                </div>
              )}
              <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="register-email">Email Address</label>
                      <input
                          id="register-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError.includes('email') ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="you@example.com"
                          autoComplete="email"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="register-password">Password</label>
                      <input
                          id="register-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                          autoComplete="new-password"
                      />
                       <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters.</p>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="register-confirm-password">Confirm Password</label>
                      <input
                          id="register-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary transition-colors ${formError.includes('match') ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                          autoComplete="new-password"
                      />
                  </div>
                  
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                  >
                      {isLoading ? (
                        <>
                          <Spinner />
                          <span>Registering...</span>
                        </>
                      ) : 'Register with Email'}
                  </button>
              </form>
              <p className="text-center text-sm text-brand-text mt-8">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
                      Login here
                  </Link>
              </p>
          </div>
      </div>
    </>
  );
};

export default RegisterPage;