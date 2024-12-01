import React, { useEffect, useState } from 'react';
import AzureAuthService from '../services/AzureAuthService';  
import { IAccountInfo } from '../interfaces/IAzureAuthService';

const UserProfile: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<IAccountInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const accounts = AzureAuthService.getAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          setAccountInfo({
            name: account.name,
            username: account.username,
            localAccountId: account.localAccountId,
            idTokenClaims: account.idTokenClaims
          });

          const token = await AzureAuthService.getTokenAccess();
          setAccessToken(token);
        }
      } catch (err) {
        setError('Erro ao adquirir token: ' + err);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleLogout = () => {
    AzureAuthService.logout();
  };

  return (
    <div className="user-profile">
      <h2>Informações do Usuário Autenticado</h2>
      {accountInfo ? (
        <>
          <p><strong>Nome Completo:</strong> {accountInfo.name}</p>
          <p><strong>Username:</strong> {accountInfo.username}</p>
          <p><strong>Localidade:</strong> {accountInfo.localAccountId}</p>
          <p><strong>Identidade (IdTokenClaims):</strong></p>
          <ul>
            {Object.entries(accountInfo.idTokenClaims || {}).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
          <h2>Token de Acesso</h2>
          {accessToken ? (
            <span>{accessToken}</span>
          ) : (
            <p>Carregando token...</p>
          )}
          <br/>
          <br/>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Você não está autenticado.</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UserProfile;
