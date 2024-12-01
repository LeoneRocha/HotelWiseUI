import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import LocalStorageService from '../services/localStorageService';

const Callback: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance.handleRedirectPromise().then((response) => {
      if (response && response.accessToken) {
        // Armazenando o token no LocalStorage
        LocalStorageService.setItem('azureAccessToken', response.accessToken);
        //LocalStorageService.setItem('token', response.accessToken);

        // Redirecionar para a página de perfil
        navigate('/profile');  
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [instance, navigate]);

  return <div>Processando login...</div>;
};

export default Callback;
