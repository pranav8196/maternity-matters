import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios for API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  // Configure axios instance to include token
  const authAxios = axios.create({
    baseURL: API_BASE_URL,
  });

  authAxios.interceptors.request.use(
    (config) => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        config.headers['Authorization'] = `Bearer ${storedToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchUserDetails = useCallback(async (userToken) => {
    if (userToken) {
      try {
        // You might want a dedicated /api/auth/me endpoint to get user details
        // For now, we assume the token itself implies authentication, and user email is stored.
        // If your login endpoint returns user details, store them.
        const storedUserEmail = localStorage.getItem('userEmail');
        const storedUserId = localStorage.getItem('userId');
        if (storedUserEmail && storedUserId) {
          setCurrentUser({ email: storedUserEmail, id: storedUserId, token: userToken });
        } else {
          // If email/ID not in localStorage, maybe fetch from a '/me' endpoint
          // For this example, if not found, we'll clear inconsistent state
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userId');
          setToken(null);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user details or token invalid", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        setToken(null);
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserDetails(storedToken);
    } else {
      setLoading(false);
    }
  }, [fetchUserDetails]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: receivedToken, userId, email: userEmail } = response.data;
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', userEmail);
      setToken(receivedToken);
      setCurrentUser({ id: userId, email: userEmail, token: receivedToken });
      return response.data;
    } catch (error) {
      console.error("Login error in AuthContext:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('Login failed');
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
      return response.data; // Typically just a success message
    } catch (error) {
      console.error("Registration error in AuthContext:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setToken(null);
    setCurrentUser(null);
    // No need for window.location.href, Router will handle redirect via ProtectedRoute
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    authAxios // Provide the configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}