import React, { useEffect, useState, useRef } from 'react';
import HotelService from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';
import HotelListTemplate from './HotelListTemplate';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<IHotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);
  const [filter, setFilter] = useState('');
  const isFetching = useRef(false); // Usado para evitar chamadas duplicadas à API

  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true;
      const fetchHotels = async () => {
        const hotels = await HotelService.getAllHotels();
        setHotels(hotels);
        setFilteredHotels(hotels); // Inicializa o estado dos hotéis filtrados
        isFetching.current = false; // Marca como executado
      };
      fetchHotels();
    }
  }, []);

  const handleDelete = async (id: number) => {
    await HotelService.deleteHotel(id);
    setHotels(hotels.filter(hotel => hotel.hotelId !== id));
    setFilteredHotels(filteredHotels.filter(hotel => hotel.hotelId !== id)); // Atualiza os hotéis filtrados
  };

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue);
    if (filterValue === '') {
      setFilteredHotels(hotels); // Volta aos resultados anteriores se o filtro for limpo
    } else {
      setFilteredHotels(hotels.filter(hotel =>
        hotel.hotelName.toLowerCase().includes(filterValue.toLowerCase()) ||  hotel.city.toLowerCase().includes(filterValue.toLowerCase()) 
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