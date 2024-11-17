import React, { useEffect, useState, useRef } from 'react';
import { getAllHotels, deleteHotel } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel'; 
import HotelListTemplate from './HotelListTemplate';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);
  const isFetching = useRef(false); // Usado para evitar chamadas duplicadas à API

  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true;
      const fetchHotels = async () => {
        const hotels = await getAllHotels();
        setHotels(hotels);
        isFetching.current = false; // Marca como executado
      };
      fetchHotels();
    }
  }, []);

  const handleDelete = async (id: number) => {
    await deleteHotel(id);
    setHotels(hotels.filter(hotel => hotel.hotelId !== id));
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <HotelListTemplate
      hotels={currentHotels}
      totalHotels={hotels.length}
      currentPage={currentPage}
      hotelsPerPage={hotelsPerPage}
      handleDelete={handleDelete}
      paginate={paginate}
    />
  );
};

export default HotelList;
