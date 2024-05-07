import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseJwt } from  '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokens, setTokens] = useState({
    AccessToken: null,
    IdToken: null,
    RefreshToken: null
  });

  useEffect(() => {
    const storedTokens = {
      AccessToken: localStorage.getItem('AccessToken'),
      IdToken: localStorage.getItem('IdToken'),
      RefreshToken: localStorage.getItem('RefreshToken')
    };

    if (storedTokens.IdToken && storedTokens.AccessToken && storedTokens.RefreshToken) {
      setTokens(storedTokens);
      setIsAuthenticated(true);
      //const decoded = parseJwt(tokens.IdToken);
      //console.log('token decodeedd login', decoded);
      //console.log('user idd decodeedd login', decoded.sub);
      setUserId(localStorage.getItem('userId'));
      console.log('user idd decodeedd login', localStorage.getItem('userId'));
    }
    setAuthReady(true);
  }, []);

  const login = (tokens) => {
    localStorage.setItem('AccessToken', tokens.AccessToken);
    localStorage.setItem('IdToken', tokens.IdToken);
    localStorage.setItem('RefreshToken', tokens.RefreshToken);

    const decoded = parseJwt(tokens.IdToken);
    console.log('token decodeedd', decoded);
    console.log('user idd decodeedd', decoded.sub);
    localStorage.setItem('userId', decoded.sub);

    setUserId(decoded.sub);
    setTokens(tokens);
    setIsAuthenticated(true);
    setAuthReady(true);
  };

  const logout = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('IdToken');
    localStorage.removeItem('RefreshToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setTokens({
      AccessToken: null,
      IdToken: null,
      RefreshToken: null
    });
    setAuthReady(true);
    setUserId(null);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    tokens,
    authReady,
    userId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};