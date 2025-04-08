import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HotelList from './components/hotel/HotelList';
import HotelForm from './components/hotel/HotelForm';
import HotelSearch from './components/hotel/HotelSearch';
import Login from './components/general/Login';
import NotFound from './components/general/NotFound';
import AccessDenied from './components/general/AccessDenied'; // Novo componente
import AuthGuard from './components/general/AuthGuard'; 
import PrivacyPolicy from './components/general/PrivacyPolicy';
import Callback from './components/general/Callback';
import UserProfile from './components/general/UserProfile';
import HotelEditPage from './components/hotel/HotelEditPage';

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
         <Route path="/tabs/:id" element={
        <AuthGuard>
          <HotelEditPage />
        </AuthGuard>
      } />
      <Route path="/access-denied" element={<AccessDenied />} /> {/* Rota para acesso negado */}
      <Route path="*" element={<NotFound />} /> {/* Rota de fallback */} 
      <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
      <Route path="/callback" element={<Callback/>} /> 
      <Route path="/perfil"  element={<UserProfile/>} />
    </Routes>
    
  );
};

export default AppRoutes;
