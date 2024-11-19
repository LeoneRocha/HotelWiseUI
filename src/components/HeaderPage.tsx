import React from 'react';
import '../App.css';
import '../css/HeaderPage.css'; // Importando CSS específico do header

const HeaderPage: React.FC = () => {
  return (
    <header className="header-container text-white text-center py-3">
      <h1>Pesquisa de Hotel IA</h1>
    </header>
  );
};

export default HeaderPage;
