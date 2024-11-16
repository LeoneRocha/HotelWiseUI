import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelList from './components/HotelList';
import HotelForm from './components/HotelForm';
import HotelSearch from './components/HotelSearch';

const AppRoutes: React.FC = () => {
    const handleSave = () => {
        // Lógica para lidar com a ação de salvar, se necessário
      };
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HotelSearch />} />
        <Route path="/list" element={<HotelList />} />
        <Route path="/edit/:id" element={<HotelForm onSave={handleSave} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
