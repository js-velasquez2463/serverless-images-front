import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authReady } = useAuth();

  console.log("entroo accaa", isAuthenticated)

  if (!authReady) {
    return <div>Cargando...</div>; // O un componente de carga más elaborado
  }

  if (!isAuthenticated) {
    // Redirige al usuario al login si no está autenticado
    return <Navigate to="/login" />;
  }

  return children;
};
