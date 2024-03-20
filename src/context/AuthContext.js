import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setToken(token?.IdToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setToken(null);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
