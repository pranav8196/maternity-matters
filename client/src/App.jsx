import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import AccountActivationPage from './pages/AccountActivationPage';
import OurProcessPage from './pages/OurProcessPage';
import AboutUsPage from './pages/AboutUsPage'; 
import Chatbot from './components/Chatbot';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import WhatsAppButton from './components/WhatsAppButton'; // <<< 1. IMPORT THE NEW COMPONENT
import { useAuth } from './contexts/AuthContext';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-background">
        <p className="text-xl font-semibold text-brand-primary">Loading Application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-text">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: { style: { background: '#F0FFF4', color: '#2F855A', border: '1px solid #9AE6B4' } },
          error: { style: { background: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2' } },
        }}
      />
      
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <HomePage />} />
          <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/activate-account" element={<AccountActivationPage />} />
          <Route path="/our-process" element={<OurProcessPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/new-complaint" element={<ProtectedRoute><NewComplaintPage /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><ViewComplaintsPage /></ProtectedRoute>} />
          
          <Route path="*" element={
            <div className="text-center py-10 container mx-auto px-4">
              <h2 className="text-3xl font-bold text-brand-primary">404: Page Not Found</h2>
              <p className="text-brand-text mt-2">Sorry, the page you are looking for does not exist.</p>
              <Link to="/" className="mt-4 inline-block bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-primary-hover">
                Go to Homepage
              </Link>
            </div>
          } />
        </Routes>
      </main>
      <WhatsAppButton /> {/* <<< 2. ADD THE WHATSAPP BUTTON COMPONENT */}
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;