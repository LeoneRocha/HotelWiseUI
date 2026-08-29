import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router';
import LocalStorageService from '../../services/general/localStorageService';
import { nameStorageTokenAzureAD } from '../../auth-config';
import EnvironmentService from '../../services/general/EnvironmentService';

const Callback: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance.handleRedirectPromise().then((response) => {
      if (response?.accessToken) {
        // Armazenando o token no LocalStorage
        LocalStorageService.setItem(nameStorageTokenAzureAD, response.accessToken);
        // Redirecionar para a página de perfil
        navigate('/login');
      }
    }).catch((error) => {
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error(error);
      } 
    });
  }, [instance, navigate]);

  return <div>Processando login...</div>;
};

export default Callback;
