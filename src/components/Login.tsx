import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../services/authService';
import SecurityService from '../services/securityService';
import LoginFormTemplate from './LoginFormTemplate';
import '../css/Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verifica se o usuário já está logado ao montar o componente
  useEffect(() => {
    const token = SecurityService.getToken();
    if (token && SecurityService.isTokenValid(token)) {
      navigate('/search');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

    try {
      const response = await authenticate({ login: sanitizedUsername, password: sanitizedPassword });
      if (response.success) {
        SecurityService.setToken(response.data.tokenAuth.accessToken);
        navigate('/search');
      } else {
        setError('Autenticação falhou. Por favor, verifique suas credenciais.');
      }
    } catch (error) {
      setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    }
  };

  const handleAzureLogin = () => {
    window.location.href = 'URL_DO_AZURE_AD';
  };

  return (
    <LoginFormTemplate
      username={username}
      password={password}
      error={error}
      onUsernameChange={(e) => setUsername(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleSubmit}
      onAzureLogin={handleAzureLogin}
    />
  );
};

export default Login;
