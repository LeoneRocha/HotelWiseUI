import React from 'react';
import { Navigate } from 'react-router-dom';
import LocalStorageService from '../services/general/localStorageService';
import SecurityService from '../services/general/securityService';
import { IAuthGuardProps } from '../interfaces/IAuthGuardProps';
import { nameStorageTokenJWT } from '../auth-config';

const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const token = LocalStorageService.getItem(nameStorageTokenJWT);

  // Verificação se o token é válido
  if (token) {
    if (SecurityService.isTokenExpired(nameStorageTokenJWT, token)) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  // Se o token não existir, redirecionar para a tela de acesso negado
  return <Navigate to="/access-denied" />;
};

export default AuthGuard;
