import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance.handleRedirectPromise().then((response) => {
      if (response) {
        navigate('/search');  
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [instance, navigate]);

  return <div>Processando login...</div>;
};

export default Callback;
