import React from 'react';
import { LoginFormTemplateProps } from '../interfaces/LoginFormTemplateProps';
 
const LoginFormTemplate: React.FC<LoginFormTemplateProps> = ({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onAzureLogin,
}) => {
  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card">
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Digite seu usuário"
              value={username}
              onChange={onUsernameChange}
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
              onChange={onPasswordChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Entrar</button>
        </form>
        <hr />
        <div className="text-center">
          <p>Ou entre com</p>
          <button onClick={onAzureLogin} className="btn btn-light w-100">Entrar com conta Microsoft</button>
        </div>
      </div>
    </div>
  );
};

export default LoginFormTemplate;
