import React from 'react';
import '../css/HotelSearchTemplate.css';
import { HotelSearchTemplateProps } from '../interfaces/HotelSearchTemplateProps';

const HotelSearchTemplate: React.FC<HotelSearchTemplateProps> = ({
  searchTerm,
  setSearchTerm,
  serviceResponse,
  searched,
  error,
  loading,
  handleSearch,
  showAlert,
  setShowAlert,
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
      ) : (
        <>
          {error && (
            <div className="alert alert-warning w-100 text-center" role="alert">
              {error}
            </div>
          )}
          <div className="row w-100">
            {serviceResponse && serviceResponse.data.hotelsVectorResult.length > 0 && (
              serviceResponse.data.hotelsVectorResult.map(hotel => (
                <div key={hotel.hotelId} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                      <i className="fas fa-hotel fa-4x text-muted"></i>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{hotel.hotelName}
                        <i className="fas fa-info-circle text-muted" title={`Pontuação: ${hotel.score}`} style={{ marginLeft: '10px' }}></i>
                      </h5>
                      <p className="card-text"><strong>Descrição:</strong> {hotel.description}</p>
                      <p className="card-text"><strong>Tags:</strong> {hotel.tags.join(', ')}</p>
                      <p className="card-text"><strong>Estrelas:</strong> {renderStars(hotel.stars)}</p>
                      <p className="card-text"><strong>Preço Inicial:</strong> R${hotel.initialRoomPrice.toFixed(2)}</p>
                      <p className="card-text"><strong>Localização:</strong> {hotel.location}, {hotel.city} - {hotel.stateCode}</p>
                      <p className="card-text"><strong>CEP:</strong> {hotel.zipCode}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {serviceResponse && serviceResponse.data.hotelsIAResult.length > 0 && (
              serviceResponse.data.hotelsIAResult.map(hotel => (
                <div key={hotel.hotelId} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                      <i className="fas fa-hotel fa-4x text-muted"></i>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{hotel.hotelName}
                        <i className="fas fa-info-circle text-muted" title={`Pontuação: ${hotel.score}`} style={{ marginLeft: '10px' }}></i>
                      </h5>
                      <p className="card-text"><strong>Descrição:</strong> {hotel.description}</p>
                      <p className="card-text"><strong>Tags:</strong> {hotel.tags.join(', ')}</p>
                      <p className="card-text"><strong>Estrelas:</strong> {renderStars(hotel.stars)}</p>
                      <p className="card-text"><strong>Preço Inicial:</strong> R${hotel.initialRoomPrice.toFixed(2)}</p>
                      <p className="card-text"><strong>Localização:</strong> {hotel.location}, {hotel.city} - {hotel.stateCode}</p>
                      <p className="card-text"><strong>CEP:</strong> {hotel.zipCode}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {serviceResponse && serviceResponse.errors.length > 0 && showAlert && (
            <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
              <strong>Erros:</strong>
              <ul>
                {serviceResponse.errors.map((err, index) => (
                  <li key={index}>{err.message || 'Erro desconhecido'}</li>
                ))}
              </ul>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAlert(false)}></button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelSearchTemplate;
