import React from 'react';
import { Navigate } from 'react-router-dom';
import LocalStorageService from '../services/localStorageService';
import SecurityService from '../services/securityService';
import { AuthGuardProps } from '../interfaces/AuthGuardProps';

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = LocalStorageService.getItem('token');

  // Verificação se o token é válido
  if (token) {
    if (SecurityService.isTokenExpired(token)) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  // Se o token não existir, redirecionar para a tela de acesso negado
  return <Navigate to="/access-denied" />;
};

export default AuthGuard;
