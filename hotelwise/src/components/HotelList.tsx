import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllHotels, deleteHotel } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';
import { Pagination } from 'react-bootstrap';
import './HotelList.css'; // Adicione um arquivo CSS para customizações adicionais

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);

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

  // Paginação
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Lista de Hotéis</h1>
        <Link to="/edit/new" className="btn btn-success">
          <i className="fas fa-plus"></i> Adicionar Novo Hotel
        </Link>
      </div>
      <div className="row">
        {currentHotels.map(hotel => (
          <div key={hotel.hotelId} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                <i className="fas fa-hotel fa-4x text-muted"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">{hotel.hotelName}</h5>
                <p className="card-text">{hotel.description}</p>
                <div className="d-flex justify-content-between">
                  <Link to={`/edit/${hotel.hotelId}`} className="btn btn-primary">
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(hotel.hotelId)}>
                    <i className="fas fa-trash-alt"></i> Apagar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination className="justify-content-center mt-4">
        {Array.from({ length: Math.ceil(hotels.length / hotelsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default HotelList;
