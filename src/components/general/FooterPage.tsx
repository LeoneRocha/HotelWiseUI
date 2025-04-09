import React, { useEffect, useState, useRef } from 'react';
import AppInformationService from '../../services/appInformationService';
import EnvironmentService from '../../services/general/EnvironmentService';
import reactLogo from '../../assets/react.svg'; 
import '../../css/FooterPage.css';

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
        const data = await AppInformationService.getAppInformationVersionProduct();
        if (data && data.length > 0) {
          setApiVersion(data[0].version);
        }
      } catch (error) {
        if (EnvironmentService.isNotTestEnvironment()) {
          console.error('Erro ao buscar a versão da API:', error);
        }
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
            <img src='/vite.svg' className="logo" alt="Vite" title='Vite' />
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
            <a href="https://github.com/LeoneRocha/HotelWiseUI" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg " alt="GitHub" title="GitHub" className="white-icon" />
            </a>
            <a href="https://www.nginx.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://static.cdnlogo.com/logos/n/17/nginx.svg" alt="Nginx Server" title="Nginx Server" />
            </a>
            <a href="https://jestjs.io/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" alt="JEST" title="JEST" />
            </a>
            <a href="https://sonarcloud.io/summary/new_code?id=lionscorp_hotelwiseui" target="_blank" rel="noopener noreferrer">
              <img src="https://static.cdnlogo.com/logos/s/13/sonarcloud.svg" alt="SonarCloud" title="SonarCloud" />
            </a>
            <a href="https://hub.docker.com/r/leonecr/hotelwiseui" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg" alt="Docker Hub" title="Docker Hub" />
            </a>
            <a href="https://azure.microsoft.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original-wordmark.svg" alt="Azure Cloud" title="Azure Cloud" />
            </a>
            <a href="https://painelbd.host.uol.com.br/main.html?servicetype=mysql" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL" title="MySQL" />
            </a>
            <a href="https://lionscorp.visualstudio.com/VariousStudies/_build" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg" alt="Azure DevOps" title="Azure DevOps" />
            </a>            
            <a href="https://qdrant.tech/" target="_blank" rel="noopener noreferrer">
              <img src="https://qdrant.tech/img/brand-resources-logos/logo.svg" alt="qdrant" title="qdrant" />
            </a>
            <a href="https://mistral.ai/" target="_blank" rel="noopener noreferrer">
              <img src="https://custom.typingmind.com/assets/models/mistralai.png" alt="mistral" title="mistral" />
            </a>
            <a href="https://groq.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://groq.com/wp-content/uploads/2024/03/PBG-mark1-color.svg" alt="Powered by Groq for fast inference." title="Powered by Groq for fast inference." className="white-icon" />
            </a>
          </div>
        </div>
        <br />
      </div>
    </footer>
  );
};

export default FooterPage;