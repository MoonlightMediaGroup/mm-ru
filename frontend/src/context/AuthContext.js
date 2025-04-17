// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile, login, logout } from '../utils/api';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const loginUser = async (data, rememberMe) => {
    const response = await login(data);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    if (rememberMe) {
      Cookies.set('refresh_token', response.data.refresh, { expires: 30 });
    }
    const userResponse = await getUserProfile();
    setUser(userResponse.data);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};