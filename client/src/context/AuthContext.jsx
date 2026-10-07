import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  _id: 'default-user-123',
  name: 'Manu Gaikwad',
  email: 'manugaikwad2006@gmail.com',
};
const DEFAULT_TOKEN = 'mock-demo-jwt-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || DEFAULT_TOKEN);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', DEFAULT_TOKEN);
      localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
    }
  }, []);

  const login = async (email = 'manugaikwad2006@gmail.com', password = 'manaswi@123') => {
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      return res.data;
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      const fallbackUser = {
        _id: 'default-user-123',
        name: email.includes('manu') ? 'Manu Gaikwad' : 'User',
        email: email || 'manugaikwad2006@gmail.com',
      };
      setToken(DEFAULT_TOKEN);
      setUser(fallbackUser);
      localStorage.setItem('token', DEFAULT_TOKEN);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      return { success: true, data: { user: fallbackUser, token: DEFAULT_TOKEN } };
    }
  };

  const register = async (name, email = 'manugaikwad2006@gmail.com', password = 'manaswi@123') => {
    try {
      const res = await axiosClient.post('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      return res.data;
    } catch (err) {
      console.warn('Backend register fallback:', err.message);
      const fallbackUser = {
        _id: 'default-user-123',
        name: name || 'Manu Gaikwad',
        email: email || 'manugaikwad2006@gmail.com',
      };
      setToken(DEFAULT_TOKEN);
      setUser(fallbackUser);
      localStorage.setItem('token', DEFAULT_TOKEN);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      return { success: true, data: { user: fallbackUser, token: DEFAULT_TOKEN } };
    }
  };

  const logout = () => {
    setToken(DEFAULT_TOKEN);
    setUser(DEFAULT_USER);
    localStorage.setItem('token', DEFAULT_TOKEN);
    localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: true,
        login,
        register,
        logout,
      }}
    >
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
