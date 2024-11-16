import React from 'react';
import { Link } from 'react-router-dom';
import { IHotel } from '../interfaces/IHotel';
import { Pagination } from 'react-bootstrap';
import './HotelList.css'; // Adicione um arquivo CSS para customizações adicionais

interface HotelListTemplateProps {
  hotels: IHotel[];
  totalHotels: number;
  currentPage: number;
  hotelsPerPage: number;
  handleDelete: (id: number) => void;
  paginate: (pageNumber: number) => void;
}

const HotelListTemplate: React.FC<HotelListTemplateProps> = ({
  hotels,
  totalHotels,
  currentPage,
  hotelsPerPage,
  handleDelete,
  paginate,
}) => {
  return (
    <div className="container-fluid mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Lista de Hotéis</h1>
        <Link to="/edit/new" className="btn btn-success">
          <i className="fas fa-plus"></i> Adicionar Novo Hotel
        </Link>
      </div>
      <div className="row">
        {hotels.map(hotel => (
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
        {Array.from({ length: Math.ceil(totalHotels / hotelsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default HotelListTemplate;
