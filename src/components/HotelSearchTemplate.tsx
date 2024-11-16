import React from 'react';
import { IHotel } from '../interfaces/IHotel';
import './HotelSearchTemplate.css';

interface HotelSearchTemplateProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  hotels: IHotel[];
  searched: boolean;
  error: string | null;
  loading: boolean;
  handleSearch: (e: React.FormEvent) => void;
  handleAdminClick: () => void;
}

const HotelSearchTemplate: React.FC<HotelSearchTemplateProps> = ({
  searchTerm,
  setSearchTerm,
  hotels,
  searched,
  error,
  loading,
  handleSearch,
  handleAdminClick,
}) => {
  const renderStars = (stars: number) => {
    return [...Array(stars)].map((_, i) => (
      <i key={i} className="fas fa-star star-gold"></i>
    ));
  };

  return (
    <div className="container-fluid mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Buscar Hotéis</h2>
        <button className="btn btn-secondary" onClick={handleAdminClick}>Admin</button>
      </div>
      <form onSubmit={handleSearch} className="input-group mb-4 w-100">
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar hotéis..."
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Pesquisando...</span>
          </div>
        </div>
      ) : !searched ? (
        <div className="alert alert-info w-100 text-center" role="alert">
          Digite no campo acima para pesquisar hotéis.
        </div>
      ) : error ? (
        <div className="alert alert-warning w-100 text-center" role="alert">
          {error}
        </div>
      ) : (
        <div className="row w-100">
          {hotels.length > 0 ? (
            hotels.map(hotel => (
              <div key={hotel.hotelId} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                    <i className="fas fa-hotel fa-4x text-muted"></i>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{hotel.hotelName}</h5>
                    <p className="card-text"><strong>Descrição:</strong> {hotel.description}</p>
                    <p className="card-text"><strong>Tags:</strong> {hotel.tags.join(', ')}</p>
                    <p className="card-text"><strong>Estrelas:</strong> {renderStars(hotel.stars)}</p>
                    <p className="card-text"><strong>Preço Inicial:</strong> R${hotel.initialRoomPrice.toFixed(2)}</p>
                    <p className="card-text"><strong>Localização:</strong> {hotel.location}, {hotel.city} - {hotel.stateCode}</p>
                    <p className="card-text"><strong>CEP:</strong> {hotel.zipCode}</p>
                    <p className="card-text pointsIA" ><strong>Pontuação:</strong> {hotel.score}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-warning w-100 text-center" role="alert">
              Nenhum hotel foi localizado com o critério digitado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelSearchTemplate;
