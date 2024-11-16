import React, { useEffect, useState } from 'react';
import { getAppInformationVersionProduct } from './services/apiService';
import './FooterPage.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const FooterPage: React.FC = () => {
  const [apiVersion, setApiVersion] = useState<string>('');
  const uiVersion = import.meta.env.VITE_UI_VERSION;

  useEffect(() => {
    const fetchApiVersion = async () => {
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
        <p><strong>UI Version:</strong> {uiVersion}</p>
        <p><strong>API Version:</strong> {apiVersion || 'Carregando...'}</p>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <div className="server-info">
            <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" title="Bootstrap" />
            </a>
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" title="TypeScript" />
            </a>
            <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" title="Node.js" />
            </a>
            <a href="https://github.com/LeoneRocha/HotelWiseUI" target="_blank" rel="noopener noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" title="GitHub" /> </a>
            <a href="https://www.nginx.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://static.cdnlogo.com/logos/n/17/nginx.svg" alt="Nginx Server" title="Nginx Server" />
            </a>
            <a href="https://hub.docker.com/r/leonecr/hotelwiseui" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg" alt="Docker Hub" title="Docker Hub" />
            </a>
            <a href="https://azure.microsoft.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original-wordmark.svg" alt="Azure Cloud" title="Azure Cloud" />
            </a>
            <a href="https://lionscorp.visualstudio.com/VariousStudies/_build" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg" alt="Azure DevOps" title="Azure DevOps" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterPage;