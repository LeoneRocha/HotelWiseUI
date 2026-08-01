import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AuthenticateService from '../../services/authService';
import SecurityService from '../../services/general/securityService';
import LocalStorageService from '../../services/general/localStorageService';
import LoginFormTemplate from './LoginFormTemplate';
import { useMsal } from '@azure/msal-react';
import '../../css/Login.css';
import { loginApiRequest, nameStorageTokenJWT } from '../../auth-config';

const Login: React.FC = () => {
  const savedUsername = LocalStorageService.getItem('rememberMeUsername') ?? '';
  const [username, setUsername] = useState(savedUsername);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(savedUsername));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();

  const getReturnPath = () => {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    if (from && from !== '/Login' && from !== '/login' && from !== '/') {
      return from;
    }
    return '/search';
  };

  useEffect(() => {
    const token = SecurityService.getToken(nameStorageTokenJWT);
    const isvalidToken = SecurityService.isTokenValid(nameStorageTokenJWT, token);

    if (token && isvalidToken) {
      navigate(getReturnPath(), { replace: true });
    }
  }, [navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

    try {
      const response = await AuthenticateService.authenticate({ login: sanitizedUsername, password: sanitizedPassword });
      if (response.success) {
        SecurityService.setToken(nameStorageTokenJWT, response.data.tokenAuth.accessToken);

        if (rememberMe) {
          LocalStorageService.setItem('rememberMeUsername', sanitizedUsername);
        } else {
          LocalStorageService.removeItem('rememberMeUsername');
        }

        navigate(getReturnPath(), { replace: true });
      } else {
        setError('Autenticação falhou. Por favor, verifique suas credenciais.');
      }
    } catch (error) {
      setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
      console.log(error);
    }
  };

  const handleAzureLogin = () => {
    instance.loginRedirect(loginApiRequest);
  };

  return (
    <LoginFormTemplate
      username={username}
      password={password}
      rememberMe={rememberMe}
      error={error}
      onUsernameChange={(e) => setUsername(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onRememberMeChange={() => setRememberMe(!rememberMe)}
      onSubmit={handleSubmit}
      onAzureLogin={handleAzureLogin}
    />
  );
};

export default Login;
