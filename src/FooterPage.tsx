import React, { useEffect, useState, useRef } from 'react';
import { getAppInformationVersionProduct } from './services/apiService';
import { EnvironmentService } from './services/EnvironmentService';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './css/FooterPage.css';

const FooterPage: React.FC = () => {
  const [apiVersion, setApiVersion] = useState<string>('');
  const uiVersion = EnvironmentService.getUIVersion();
  const actualYear = new Date().getFullYear();
  
  const hasFetchedData = useRef(false);

  useEffect(() => {
    const fetchApiVersion = async () => {
      if (hasFetchedData.current) return;
      hasFetchedData.current = true;
      try {
        const data = await getAppInformationVersionProduct();
        if (data && data.length > 0) {
          setApiVersion(data[0].version);
        }
      } catch (error) {
        console.error('Erro ao buscar a versão da API:', error);
      }
    };

    fetchApiVersion();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <br />
        <p> © {actualYear} Pesquisa de Hotel IA. All rights reserved.</p>
        <br />
        <p><strong>UI Version:</strong> {uiVersion}</p>
        <p><strong>API Version:</strong> {apiVersion || 'Carregando...'}</p>
        <div>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React" title='React' />
          </a>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite" title='Vite' />
          </a>
          <div className="server-info">
            {/* Os outros ícones e links aqui */}
          </div>
        </div>
        <br />
      </div>
    </footer>
  );
};

export default FooterPage;
