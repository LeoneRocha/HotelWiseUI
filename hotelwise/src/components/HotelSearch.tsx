import React, { useState } from 'react';
import { semanticSearch } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';

const HotelSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState<IHotel[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await semanticSearch({ query: searchTerm });
    setHotels(results);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-3">
        <input type="text" className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar hotéis..." />
        <button type="submit" className="btn btn-primary mt-2">Buscar</button>
      </form>
      <ul className="list-group">
        {hotels.map(hotel => (
          <li key={hotel.hotelId} className="list-group-item">{hotel.hotelName}</li>
        ))}
      </ul>
    </div>
  );
};

export default HotelSearch;