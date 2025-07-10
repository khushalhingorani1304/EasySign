import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api'; // Make sure this file handles API correctly

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { user, token } = response;
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const signup = async (name, email, password) => {
    const response = await authAPI.signup(name, email, password);
    const { user, token } = response;
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Optional: token verification on mount (future-proof for refresh tokens)
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!savedToken || !savedUser) return;

      try {
        // Optional backend verification
        // const verified = await authAPI.verifyToken(savedToken);
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Invalid token. Logging out.');
        logout();
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
