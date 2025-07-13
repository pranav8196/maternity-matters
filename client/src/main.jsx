import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <<< 1. IMPORT
import App from './App.jsx';
import './index.css'; 
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';

// It's best practice to get your Client ID from an environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- 2. WRAP YOUR ENTIRE APP WITH GOOGLEOAUTHPROVIDER --- */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);