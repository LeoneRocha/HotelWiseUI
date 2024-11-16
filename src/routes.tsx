import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HotelList from './components/HotelList';
import HotelForm from './components/HotelForm';
import HotelSearch from './components/HotelSearch';
import Login from './components/Login';

const AppRoutes: React.FC = () => {
  const handleSave = () => {
    // Lógica para lidar com a ação de salvar, se necessário
  };
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/search" element={<HotelSearch />} />
      <Route path="/list" element={<HotelList />} />
      <Route path="/edit/:id" element={<HotelForm onSave={handleSave} />} />
    </Routes>
  );
};

export default AppRoutes;
