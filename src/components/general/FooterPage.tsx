import React, { useEffect, useState, useRef } from 'react';
import AppInformationService from '../../services/appInformationService';
import EnvironmentService from '../../services/general/EnvironmentService';
import TechnologyCatalogService from '../../services/technologyCatalogService';
import { ITechnologyResource, TechnologyLayer } from '../../interfaces/ITechnologyResource';
import '../../css/FooterPage.css';

const LAYER_LABELS: Record<TechnologyLayer, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  resources: 'Recursos',
};

const LAYER_ORDER: TechnologyLayer[] = ['frontend', 'backend', 'resources'];

const FooterPage: React.FC = () => {
  const [apiVersion, setApiVersion] = useState<string>('');
  const [technologies, setTechnologies] = useState<ITechnologyResource[]>([]);
  const [showTextCatalog, setShowTextCatalog] = useState(false);
  const uiVersion = EnvironmentService.getUIVersion();
  const actualYear = new Date().getFullYear();

  const hasFetchedData = useRef(false);

  useEffect(() => {
    const loadFooterData = async () => {
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

      try {
        const catalog = await TechnologyCatalogService.getTechnologies();
        setTechnologies(catalog);
      } catch (error) {
        if (EnvironmentService.isNotTestEnvironment()) {
          console.error('Erro ao carregar catálogo de tecnologias:', error);
        }
      }
    };

    loadFooterData();
  }, []);

  const byLayer = (layer: TechnologyLayer) =>
    technologies.filter((item) => item.layer === layer);

  const renderTechIcon = (item: ITechnologyResource) => (
    <a
      key={item.id}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={item.image}
        className={item.invertIcon ? 'white-icon' : undefined}
        alt={item.name}
        title={item.name}
      />
    </a>
  );

  return (
    <footer className="footer">
      <div className="container">
        <p> © {actualYear} Pesquisa de Hotel IA. All rights reserved.</p>
        <p><strong>UI Version:</strong> {uiVersion}</p>
        <p><strong>API Version:</strong> {apiVersion || 'Carregando...'}</p>

        {technologies.length > 0 && (
          <div className="footer-tech-icons" data-testid="footer-tech-icons">
            {LAYER_ORDER.map((layer) => {
              const items = byLayer(layer);
              if (items.length === 0) return null;
              return (
                <section key={layer} className="footer-tech-icons-section">
                  <h3>{LAYER_LABELS[layer]}</h3>
                  <div className="server-info">
                    {items.map((item) => renderTechIcon(item))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="footer-catalog-toggle"
          aria-expanded={showTextCatalog}
          onClick={() => setShowTextCatalog((open) => !open)}
        >
          {showTextCatalog ? 'Ocultar detalhes textuais' : 'Exibir detalhes textuais'}
        </button>

        {showTextCatalog && (
          <div className="footer-catalog" data-testid="footer-tech-text">
            {LAYER_ORDER.map((layer) => {
              const items = byLayer(layer);
              if (items.length === 0) return null;
              return (
                <section key={layer} className="footer-catalog-section">
                  <h3>{LAYER_LABELS[layer]}</h3>
                  <ul className="footer-tech-text-list">
                    {items.map((item) => (
                      <li key={item.id}>
                        <span className="footer-tech-text-name">{item.name}</span>
                        {item.version ? (
                          <span className="footer-tech-text-version"> versão {item.version}</span>
                        ) : null}
                        {item.description ? (
                          <span className="footer-tech-text-description"> — {item.description}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
        <br />
      </div>
    </footer>
  );
};

export default FooterPage;
