import React, { useState } from 'react'; 
import { semanticSearch } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel'; 
import '../css/HotelSearch.css'; // Adicione um arquivo CSS para customizações adicionais
import HotelSearchTemplate from './HotelSearchTemplate';

const HotelSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setError(null);
    setLoading(true);
    try {
      const results = await semanticSearch({ maxHotelRetrieve: 5, searchTextCriteria: searchTerm });
      if (results.length === 0) {
        setError('Nenhum hotel foi localizado com o critério digitado.');
      }
      setHotels(results);
    } catch (err) {
      setError('Ocorreu um erro ao buscar os hotéis. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <HotelSearchTemplate
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      hotels={hotels}
      searched={searched}
      error={error}
      loading={loading}
      handleSearch={handleSearch} 
    />
  );
};

export default HotelSearch;
