import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import Modal from '../components/Modal'; // Assuming you have this for notifications

// API_BASE_URL is now handled by authAxios in AuthContext if you use it there,
// or you can keep it if your login function in AuthContext doesn't use authAxios directly for login.
// For simplicity, if login function in AuthContext uses axios.post directly with API_BASE_URL, it's fine.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(''); // For form-specific errors
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Optional: for modal notifications
  const [modalType, setModalType] = useState('info');   // Optional: for modal notifications

  const navigate = useNavigate(); // Keep navigate for explicit navigation IF NEEDED, but App.jsx should handle it
  const location = useLocation(); // To get 'from' state if needed for other navigations, though not primary for post-login redirect now
  const { login } = useAuth(); // Get the login function from AuthContext

  const from = location.state?.from?.pathname || "/dashboard"; // Still useful if login fails and user navigates elsewhere then back

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setModalMessage('');
    setIsLoading(true);
    try {
      await login(email, password); // This calls the login function from AuthContext
                                    // which updates localStorage and currentUser state.
      
      // After a successful login, the currentUser state in AuthContext is updated.
      // Your App.jsx has this route definition:
      // <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      // This means App.jsx should detect the change in currentUser and automatically
      // execute the <Navigate to="/dashboard" replace /> part.
      // So, no explicit navigation call (like navigate(from, { replace: true });) is strictly needed here.
      // If you find the declarative redirect in App.jsx is not immediate enough, you can re-add:
      // navigate(from, { replace: true }); 
      // But try without it first.

    } catch (err) {
      const errorMessage = err.error || err.errors?.map(er => er.msg).join(', ') || err.message || 'Login failed. Please check your credentials.';
      setFormError(errorMessage); // Show error directly on the form for immediate feedback
      // Optionally set modal message for more persistent error display:
      // setModalMessage(errorMessage);
      // setModalType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Optional Modal for broader notifications if you use setModalMessage */}
      <Modal message={modalMessage} type={modalType} onClose={() => setModalMessage('')} title={modalType === "error" ? "Login Failed" : "Notification"}/>
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
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
                  >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </span>
                      ) : 'Login'}
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
       {/* Basic CSS for fade-in animation (can be global or scoped) */}
       <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </>
  );
};

export default LoginPage;