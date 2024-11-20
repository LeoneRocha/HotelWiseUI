import React, { useState } from 'react';
import { semanticSearch } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';
import '../css/HotelSearch.css'; // Adicione um arquivo CSS para customizações adicionais
import HotelSearchTemplate from './HotelSearchTemplate';
import { ISearchCriteria } from '../interfaces/ISearchCriteria';
import { ServiceResponse } from '../interfaces/authTypes';
import { IHotelSemanticResult } from '../interfaces/IHotelSemanticResult';

const HotelSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceResponse, setServiceResponse] = useState<ServiceResponse<IHotelSemanticResult> | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setError(null);
    setLoading(true);
    setShowAlert(false); // Reseta o estado do alerta antes de uma nova pesquisa
    try {
      const criteria: ISearchCriteria = {
        maxHotelRetrieve: 5,
        searchTextCriteria: searchTerm,
        tagsCriteria: [],
      };
      const response: ServiceResponse<IHotelSemanticResult> = await semanticSearch(criteria);

      if (response.data.hotelsVectorResult.length === 0 && response.data.hotelsIAResult.length === 0) {
        setError('Nenhum hotel foi localizado com o critério digitado.');
      }

      setServiceResponse(response);
      setShowAlert(true); // Ativa o alerta se houver erros
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
      serviceResponse={serviceResponse}
      searched={searched}
      error={error}
      loading={loading}
      handleSearch={handleSearch}
      showAlert={showAlert} // Passa o estado do alerta para o template
      setShowAlert={setShowAlert} // Passa a função para alterar o estado do alerta
    />
  );
};

export default HotelSearch;
