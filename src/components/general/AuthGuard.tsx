import React from 'react';
import { Navigate, useLocation } from 'react-router';
import LocalStorageService from '../../services/general/localStorageService';
import SecurityService from '../../services/general/securityService';
import { IAuthGuardProps } from '../../interfaces/DTO/IAuthGuardProps';
import { nameStorageTokenJWT } from '../../auth-config';

const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const token = LocalStorageService.getItem(nameStorageTokenJWT);
  const location = useLocation();

  if (token) {
    if (SecurityService.isTokenExpired(nameStorageTokenJWT, token)) {
      return <Navigate to="/Login" state={{ from: location }} replace />;
    }
    return children;
  }

  return <Navigate to="/Login" state={{ from: location }} replace />;
};

export default AuthGuard;
