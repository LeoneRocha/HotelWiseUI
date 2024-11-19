import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AccessDenied.css';

const AccessDenied: React.FC = () => {
  return (
    <div className="access-denied-container d-flex justify-content-center align-items-center">
      <div className="access-denied-card">
        <i className="fas fa-ban access-denied-icon mb-4"></i>
        <h1 className="text-center text-danger">Acesso Negado</h1>
        <p className="lead text-center">Você não tem permissão para acessar esta página.</p>
        <Link to="/" className="btn btn-primary w-100">Voltar para a página inicial</Link>
      </div>
    </div>
  );
};
export default AccessDenied;