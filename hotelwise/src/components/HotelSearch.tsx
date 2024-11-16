import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { semanticSearch } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel'; 
import './HotelSearch.css'; // Adicione um arquivo CSS para customizações adicionais
import HotelSearchTemplate from './HotelSearchTemplate';

const HotelSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setError(null);
    try {
      const results = await semanticSearch({ maxHotelRetrieve: 5, searchTextCriteria: searchTerm });
      if (results.length === 0) {
        setError('Nenhum hotel foi localizado com o critério digitado.');
      }
      setHotels(results);
    } catch (err) {
      setError('Ocorreu um erro ao buscar os hotéis. Por favor, tente novamente.');
    }
  };

  const handleAdminClick = () => {
    navigate('/list');
  };

  return (
    <HotelSearchTemplate
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      hotels={hotels}
      searched={searched}
      error={error}
      handleSearch={handleSearch}
      handleAdminClick={handleAdminClick}
    />
  );
};

export default HotelSearch;
