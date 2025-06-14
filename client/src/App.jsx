// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestPasswordResetPage from './pages/RequestPasswordResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NewComplaintPage from './pages/NewComplaintPage';
import ViewComplaintsPage from './pages/ViewComplaintsPage';
import AccountActivationPage from './pages/AccountActivationPage'; // <-- IMPORT NEW PAGE
import { useAuth } from './contexts/AuthContext';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <p className="text-xl font-semibold text-indigo-600">Loading Application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-2 flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <HomePage />} />
          <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/activate-account" element={<AccountActivationPage />} /> {/* <-- ADD ROUTE FOR ACTIVATION */}
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/new-complaint" element={<ProtectedRoute><NewComplaintPage /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><ViewComplaintsPage /></ProtectedRoute>} />
          
          <Route path="*" element={
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-indigo-700">404: Page Not Found</h2>
              <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
              <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                Go to Homepage
              </Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;