import React, { useState, useEffect } from 'react';
import HotelService from '../../services/hotel/hotelService';
import '../../css/HotelSearch.css'; // Adicione um arquivo CSS para customizações adicionais
import HotelSearchTemplate from './HotelSearchTemplate';
import { ISearchCriteria } from '../../interfaces/model/IA/ISearchCriteria';
import { IServiceResponse } from '../../interfaces/GeneralInterfaces';
import EnvironmentService from '../../services/general/EnvironmentService';
import { IHotelSemanticResult } from '../../interfaces/model/Hotel/IHotelSemanticResult';

const HotelSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]); // Inicializando como array vazio
  const [serviceResponse, setServiceResponse] = useState<IServiceResponse<IHotelSemanticResult> | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const fetchTags = async () => {
    try {
      const fetchedTags = await HotelService.getTags();
      setTags(fetchedTags); // Atualizar estado com os dados retornados
      console.log('Resposta da API:', fetchedTags); // Verificar o retorno completo da API
    } catch (err) {
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Erro ao buscar tags:', err);
      }
    }
  };
  useEffect(() => {

    fetchTags();
  }, []);

  useEffect(() => {
    console.log("Tags carregadas no componente pai:", tags);
  }, [tags]);


  const handleTagChange = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setError(null);
    setLoading(true);
    setShowAlert(false); // Reseta o estado do alerta antes de uma nova pesquisa
    try {
      const criteria: ISearchCriteria = {
        maxHotelRetrieve: 3,
        searchTextCriteria: searchTerm,
        tagsCriteria: selectedTags,
      };
      const response: IServiceResponse<IHotelSemanticResult> = await HotelService.semanticSearch(criteria);

      if (response.data.hotelsVectorResult.length === 0 && response.data.hotelsIAResult.length === 0) {
        setError('Nenhum hotel foi localizado com o critério digitado.');
      }

      setServiceResponse(response);
      setShowAlert(true); // Ativa o alerta se houver erros
    } catch (err) {
      setError('Ocorreu um erro ao buscar os hotéis. Por favor, tente novamente.',);
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Erro ao buscar hotéis:', err);
      }
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
      tags={tags}
      selectedTags={selectedTags}
      handleTagChange={handleTagChange} // Passa a função para alterar as tags selecionadas
    />
  );
};

export default HotelSearch;
