import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import '../css/HotelList.css'; // Adicione um arquivo CSS para customizações adicionais 
import { IHotelListTemplateProps } from '../interfaces/DTO/Hotel/IHotelListTemplateProps';

const HotelListTemplate: React.FC<IHotelListTemplateProps> = ({
  hotels,
  totalHotels,
  currentPage,
  hotelsPerPage,
  handleDelete,
  paginate,
  filter,
  handleFilterChange,
}) => {
  return (
    <div className="container-fluid mt-5">
      <h1 className="text-left">Lista de Hotéis</h1>
      <div className="d-flex align-items-center mb-4">
        <Link to="/new/:new" className="btn btn-success">
          <i className="fas fa-plus"></i> Adicionar Novo Hotel
        </Link>
      </div>
      {/* Campo de filtro adicionado */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome do hotel"
          className="form-control"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        /> 
      </div>
      <div className="row">
        {hotels.map(hotel => (
          <div key={hotel.hotelId} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                <i className="fas fa-hotel fa-4x text-muted"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">{hotel.hotelName}<i className="fas fa-info-circle text-muted" title={`Id: ${hotel.hotelId}`} style={{ marginLeft: '10px' }} ></i></h5>
                <p className="card-text">{hotel.description}</p>
                <p className="card-text"><i className="fa-solid fa-city" title={`Id: ${hotel.hotelId}`} style={{ marginLeft: '10px' }} > </i> {hotel.city}</p>
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
