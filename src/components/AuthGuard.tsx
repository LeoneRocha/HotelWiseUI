
import React from 'react';
import { Navigate } from 'react-router-dom';
import LocalStorageService from '../services/localStorageService';
import { AuthGuardProps } from '../interfaces/AuthGuardProps';

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isLoggedIn = LocalStorageService.hasItem('token');

  return isLoggedIn ? children : <Navigate to="/access-denied" />;
};
export default AuthGuard;