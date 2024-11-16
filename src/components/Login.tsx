import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitização dos campos de entrada
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

    // Lógica para autenticação tradicional
    // Aqui você pode adicionar chamadas para o backend para autenticação
    console.log('Sanitized Username:', sanitizedUsername);
    console.log('Sanitized Password:', sanitizedPassword);
    navigate('/list');
  };

  const handleAzureLogin = () => {
    // Lógica para autenticação com Azure AD
    window.location.href = 'URL_DO_AZURE_AD';
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Entrar</button>
        </form>
        <hr />
        <div className="text-center">
          <p>Ou entre com</p>
          <button onClick={handleAzureLogin} className="btn btn-light w-100">Entrar com conta Microsoft</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
