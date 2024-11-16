import React, { useEffect, useState } from 'react';
import { getAllHotels, deleteHotel  } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const hotels = await getAllHotels();
      setHotels(hotels);
    };
    fetchHotels();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteHotel(id);
    setHotels(hotels.filter(hotel => hotel.hotelId !== id));
  };

  return (
    <div>
      <h1>Lista de Hotéis</h1>
      <ul className="list-group">
        {hotels.map(hotel => (
          <li key={hotel.hotelId} className="list-group-item d-flex justify-content-between align-items-center">
            {hotel.hotelName}
            <button className="btn btn-danger" onClick={() => handleDelete(hotel.hotelId)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;