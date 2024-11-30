import React from 'react';
import { useMsal } from '@azure/msal-react';

const UserProfile: React.FC = () => {
  const { accounts } = useMsal();

  if (accounts.length === 0) {
    return <div>Você não está autenticado.</div>;
  }

  const account = accounts[0];
  
  return (
    <div className="user-profile">
      <h2>Informações do Usuário Autenticado</h2>
      <p><strong>Nome Completo:</strong> {account.name}</p>
      <p><strong>Username:</strong> {account.username}</p>
      <p><strong>Localidade:</strong> {account.localAccountId}</p>
      <p><strong>Identidade (IdTokenClaims):</strong></p>
      <ul>
        {Object.entries(account.idTokenClaims || {}).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
