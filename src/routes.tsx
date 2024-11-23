import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HotelList from './components/HotelList';
import HotelForm from './components/HotelForm';
import HotelSearch from './components/HotelSearch';
import Login from './components/Login';
import NotFound from './components/NotFound';
import AccessDenied from './components/AccessDenied'; // Novo componente
import AuthGuard from './components/AuthGuard'; 
import PrivacyPolicy from './components/PrivacyPolicy';

const AppRoutes: React.FC = () => {
  const handleSave = () => {
    // Lógica para lidar com a ação de salvar, se necessário
  };
  return ( 
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/search" element={
        <AuthGuard>
          <HotelSearch />
        </AuthGuard>
      } />
      <Route path="/list" element={
        <AuthGuard>
          <HotelList />
        </AuthGuard>
      } />
      <Route path="/new/:new" element={<AuthGuard>
        <HotelForm onSave={handleSave} />
      </AuthGuard>
      } />
      <Route path="/edit/:id" element={
        <AuthGuard>
          <HotelForm onSave={handleSave} />
        </AuthGuard>
      } />
      <Route path="/access-denied" element={<AccessDenied />} /> {/* Rota para acesso negado */}
      <Route path="*" element={<NotFound />} /> {/* Rota de fallback */} 
      <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
    </Routes>
    
  );
};

export default AppRoutes;
