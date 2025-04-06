import React, { useEffect, useState, useRef } from 'react';
import HotelService from '../../services/hotel/hotelService';
import HotelListTemplate from './HotelListTemplate';
import { IHotel } from '../../interfaces/model/Hotel/IHotel';
import EnvironmentService from '../../services/general/EnvironmentService';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<IHotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para capturar erros
  const isFetching = useRef(false); // Usado para evitar chamadas duplicadas à API

  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true;
      const fetchHotels = async () => {
        try {
          const response = await HotelService.getAll();
          if (response.success) {
            setHotels(response.data);
            setFilteredHotels(response.data); // Inicializa o estado dos hotéis filtrados
          } else {
            setError(response.message || 'Ocorreu um erro ao buscar os hotéis.');
          }
        } catch (err) {
          setError('Ocorreu um erro ao buscar os hotéis.');
          if (EnvironmentService.isNotTestEnvironment()) {
            console.error('Erro ao buscar hotéis:', err);
          }
        } finally {
          isFetching.current = false; // Marca como executado
        }
      };
      fetchHotels();
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await HotelService.delete(id);
      if (response.success) {
        setHotels(hotels.filter(hotel => hotel.hotelId !== id));
        setFilteredHotels(filteredHotels.filter(hotel => hotel.hotelId !== id)); // Atualiza os hotéis filtrados
      } else {
        setError(response.message || 'Ocorreu um erro ao excluir o hotel.');
      }
    } catch {
      setError('Ocorreu um erro ao excluir o hotel.');
    }
  };

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue);
    if (filterValue === '') {
      setFilteredHotels(hotels); // Volta aos resultados anteriores se o filtro for limpo
    } else {
      setFilteredHotels(hotels.filter(hotel =>
        hotel.hotelName.toLowerCase().includes(filterValue.toLowerCase()) || hotel.city.toLowerCase().includes(filterValue.toLowerCase())
      ));
    }
    setCurrentPage(1); // Reinicia a paginação ao filtrar
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {error && <div role="alert" className="alert alert-danger">{error}</div>} {/* Renderiza o alerta em caso de erro */}
      <HotelListTemplate
        hotels={currentHotels}
        totalHotels={filteredHotels.length}
        currentPage={currentPage}
        hotelsPerPage={hotelsPerPage}
        handleDelete={handleDelete}
        paginate={paginate}
        filter={filter}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default HotelList;
