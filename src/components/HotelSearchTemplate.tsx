import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import '../css/HotelSearchTemplate.css';
import { IHotelSearchTemplateProps } from '../interfaces/IHotelSearchTemplateProps';
import { v4 as uuidv4 } from 'uuid';

const HotelSearchTemplate: React.FC<IHotelSearchTemplateProps> = ({
  searchTerm,
  setSearchTerm,
  serviceResponse,
  searched,
  error,
  loading,
  handleSearch,
  showAlert,
  setShowAlert,
  tags,
  selectedTags,
  handleTagChange,
}) => {
  const [filterTerm, setFilterTerm] = useState('');

  // Filtra as tags com base no termo digitado
  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const renderStars = (stars: number) => {
    return [...Array(stars)].map(() => (
      <i key={uuidv4()} className="fas fa-star star-gold"></i>
    ));
  };

  const sanitizedPromptContent = serviceResponse?.data?.promptResultContent
    ? DOMPurify.sanitize(serviceResponse.data.promptResultContent)
    : '';

 // Substitua a renderização atual do sanitizedContent por esta versão melhorada
const renderSanitizedContent = sanitizedPromptContent && (
  <div className="chatbot-response mb-4">
    <div className="chatbot-header">
      <div className="chatbot-avatar">
        <i className="fas fa-robot"></i>
      </div>
      <div className="chatbot-name">Hotel Wise Assistant</div>
    </div>
    <div 
      className="chatbot-message"
      dangerouslySetInnerHTML={{ __html: sanitizedPromptContent }}
    ></div>
  </div>
);


  const renderLoading = loading && (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Pesquisando...</span>
      </div>
    </div>
  );

  const renderNotSearched = !loading && !searched && (
    <div className="alert alert-info w-100 text-center" role="alert">
      Digite no campo acima para pesquisar hotéis.
    </div>
  );

  const renderError = !loading && error && (
    <div className="alert alert-warning w-100 text-center" role="alert">
      {error}
    </div>
  );

  const renderHotels = !loading && searched && !error && serviceResponse && (
    <div className="row w-100">
      {renderSanitizedContent /* Exibe mensagem antes da listagem de hotéis */}
      {serviceResponse?.data.hotelsVectorResult.length > 0 &&
        serviceResponse.data.hotelsVectorResult.map(hotel => (
          <div key={hotel.hotelId} className="col-md-4 mb-4">
            <div className="card h-100">
              <div
                className="card-img-top d-flex justify-content-center align-items-center"
                style={{ height: '200px', backgroundColor: '#f8f9fa' }}
              >
                <i className="fas fa-hotel fa-4x text-muted"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  {hotel.hotelName}
                  <i
                    className="fas fa-info-circle text-muted"
                    title={`Pontuação: ${hotel.score}`}
                    style={{ marginLeft: '10px' }}
                  ></i>
                </h5>
                <p className="card-text">
                  <strong>Descrição:</strong> {hotel.description}
                </p>
                <p className="card-text">
                  <strong>Tags:</strong> {hotel.tags.join(', ')}
                </p>
                <p className="card-text">
                  <strong>Estrelas:</strong> {renderStars(hotel.stars)}
                </p>
                <p className="card-text">
                  <strong>Preço Inicial:</strong> R$
                  {hotel.initialRoomPrice.toFixed(2)}
                </p>
                <p className="card-text">
                  <strong>Localização:</strong> {hotel.location}, {hotel.city} -{' '}
                  {hotel.stateCode}
                </p>
                <p className="card-text">
                  <strong>CEP:</strong> {hotel.zipCode}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderAlert =
    serviceResponse &&
    serviceResponse.errors.length > 0 &&
    showAlert && (
      <div
        className="alert alert-danger alert-dismissible fade show mt-4"
        role="alert"
      >
        <strong>Erros:</strong>
        <ul>
          {serviceResponse.errors.map(err => (
            <li key={uuidv4()}>{err.message ?? 'Erro desconhecido'}</li>
          ))}
        </ul>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => setShowAlert(false)}
        ></button>
      </div>
    );

  return (
    <div className="container-fluid mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Buscar Hotéis</h2>
      </div>
      <form onSubmit={handleSearch} className="input-group mb-4 w-100">
        <input
          type="text"
          className="form-control"
          value={searchTerm ?? ''}
          onChange={e => setSearchTerm(e.target.value)}
          maxLength={255}
          placeholder="Buscar hotéis..."
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
      <div className="accordion mb-4" id="tagsAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="tagsHeading">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#tagsCollapse"
              aria-expanded="true"
              aria-controls="tagsCollapse"
            >
              Adicionar filtro por tags:
            </button>
          </h2>
          <div
            id="tagsCollapse"
            className="accordion-collapse collapse show"
            aria-labelledby="tagsHeading"
            data-bs-parent="#tagsAccordion"
          >
            <div className="accordion-body">
              <input
                type="text"
                className="form-control mb-2"
                value={filterTerm}
                onChange={e => setFilterTerm(e.target.value)}
                placeholder="Filtrar tags..."
              />
              <div className="d-flex flex-wrap">
                {Array.isArray(filteredTags) &&
                  filteredTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`btn ${
                        selectedTags.includes(tag)
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                      } m-1`}
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderLoading}
      {renderNotSearched}
      {renderError}
      {renderHotels}
      {renderAlert}
    </div>
  );
};

export default HotelSearchTemplate;
