import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="notfound-container d-flex justify-content-center align-items-center">
      <div className="notfound-card">
        <i className="fas fa-search notfound-icon mb-4"></i>
        <h1 className="text-center display-1 text-primary">404</h1>
        <p className="lead text-center">Oops! Página não encontrada.</p>
        <Link to="/" className="btn btn-primary w-100">Voltar para a página inicial</Link>
      </div>
    </div>
  );
};

export default NotFound;
