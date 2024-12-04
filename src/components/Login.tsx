import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticateService from '../services/authService';
import SecurityService from '../services/securityService';
import LocalStorageService from '../services/localStorageService';
import LoginFormTemplate from './LoginFormTemplate';
import { useMsal } from '@azure/msal-react';
import '../css/Login.css';
import { loginApiRequest, nameStorageTokenJWT } from '../auth-config';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { instance } = useMsal();

  useEffect(() => {
    const token = SecurityService.getToken(nameStorageTokenJWT);
    const isvalidToken = SecurityService.isTokenValid(nameStorageTokenJWT, token);

    if (token && isvalidToken) {
      navigate('/search');
    } else {
      const savedUsername = LocalStorageService.getItem('rememberMeUsername');
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

    try {
      const response = await AuthenticateService.authenticate({ login: sanitizedUsername, password: sanitizedPassword });
      if (response.success) {
        SecurityService.setToken(nameStorageTokenJWT, response.data.tokenAuth.accessToken);

        if (rememberMe) {
          console.log('Remember me is checked. Setting item in localStorage.');
          LocalStorageService.setItem('rememberMeUsername', sanitizedUsername);
        } else {
          LocalStorageService.removeItem('rememberMeUsername');
        }

        navigate('/search');
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
