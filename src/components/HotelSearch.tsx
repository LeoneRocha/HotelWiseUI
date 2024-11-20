import React, { useState } from 'react';
import { semanticSearch } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';
import '../css/HotelSearch.css'; // Adicione um arquivo CSS para customizações adicionais
import HotelSearchTemplate from './HotelSearchTemplate';
import { ISearchCriteria } from '../interfaces/ISearchCriteria';
import { IHotelSemanticResult } from '../interfaces/IHotelSemanticResult';

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
      const criteria: ISearchCriteria = {
        maxHotelRetrieve: 5,
        searchTextCriteria: searchTerm,
        tagsCriteria: [],
      };
      const results: IHotelSemanticResult = await semanticSearch(criteria);

      if (results.hotelsVectorResult.length === 0 && results.hotelsIAResult.length === 0) {
        setError('Nenhum hotel foi localizado com o critério digitado.');
      }

      // Combina ambos os resultados em um único array
      setHotels([...results.hotelsVectorResult, ...results.hotelsIAResult]);
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
