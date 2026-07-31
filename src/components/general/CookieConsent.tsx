// src/components/CookieConsent.tsx
import React, { useState, useEffect } from 'react';
import LocalStorageService from '../../services/general/localStorageService';
import '../../css/CookieConsent.css'; 

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(
    () => !LocalStorageService.getItem('cookieConsent'),
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  const handleAccept = () => {
    LocalStorageService.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const handleDecline = () => { 
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-modal bg-dark text-white p-4">
        <div className="mb-3">
          <p>Este site utiliza cookies para melhorar a experiência do usuário e analisar o tráfego do site. Consulte nossa <a href="/privacy-policy" target="_blank" className="text-white text-decoration-underline">Política de Privacidade</a> para mais informações.</p>
        </div>
        <div className="text-center">
          <button className="btn btn-primary me-2" onClick={handleAccept}>Aceitar</button>
          <button className="btn btn-secondary" onClick={handleDecline}>Recusar</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
