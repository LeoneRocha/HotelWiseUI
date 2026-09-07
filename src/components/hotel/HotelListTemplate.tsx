import React from 'react';
import { Link } from 'react-router';
import { Pagination } from 'react-bootstrap';
import '../../css/HotelList.css'; // Adicione um arquivo CSS para customizações adicionais
import { IHotelListTemplateProps } from '../../interfaces/DTO/Hotel/IHotelListTemplateProps';

const getFeedbackIcon = (type?: string): string => {
  if (type === 'success') return 'check-circle';
  if (type === 'warning') return 'exclamation-triangle';
  return 'times-circle';
};

const HotelListTemplate: React.FC<IHotelListTemplateProps> = ({
  hotels = [], // Garante que `hotels` tenha um valor padrão como array vazio
  totalHotels = 0, // Valor padrão para evitar erros de cálculo
  currentPage = 1, // Define página inicial como padrão
  hotelsPerPage = 6,
  handleDelete = () => { }, // Função vazia por padrão
  paginate = () => { }, // Função vazia por padrão
  filter = '', // Fallback para string vazia
  handleFilterChange = () => { }, // Função vazia por padrão
  handleSyncAllToVectorStore,
  isSyncing = false,
  syncFeedback = null,
  onDismissSyncFeedback,
}) => {
  const totalPages = Math.ceil(totalHotels / hotelsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="container-fluid mt-5">
      <h1 className="text-left">Lista de Hotéis</h1>
      <div className="d-flex align-items-center mb-4 gap-2 flex-wrap">
        <Link to="/new/:new" className="btn btn-success" id="btn-add-hotel">
          <i className="fas fa-plus"></i> Adicionar Novo Hotel
        </Link>
        {handleSyncAllToVectorStore && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSyncAllToVectorStore}
            disabled={isSyncing}
            id="btn-sync-all-vector"
            title="Sincronizar todos os hotéis no Vector Store (Qdrant)"
          >
            {isSyncing ? (
              <>
                <output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>{' '}
                Sincronizando no Vetor...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt me-2"></i>{' '}
                Sincronizar Hotéis no Vetor
              </>
            )}
          </button>
        )}
      </div>
      {syncFeedback && (
        <output
          className={`alert alert-${syncFeedback.type} alert-dismissible fade show mb-4 d-block`}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <i className={`fas fa-${getFeedbackIcon(syncFeedback.type)} me-2`}></i>
              <strong>{syncFeedback.message}</strong>
            </div>
            {onDismissSyncFeedback && (
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onDismissSyncFeedback}
              ></button>
            )}
          </div>
          {syncFeedback.details && syncFeedback.details.length > 0 && (
            <ul className="mt-2 mb-0 small">
              {syncFeedback.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
        </output>
      )}
      {/* Campo de filtro */}
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
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.hotelId} className="col-md-4 mb-4">
              <div className="card">
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
                      title={`Id: ${hotel.hotelId}`}
                      style={{ marginLeft: '10px' }}
                    ></i>
                  </h5>
                  <p className="card-text">{hotel.description}</p>
                  <p className="card-text">
                    <i className="fa-solid fa-city" style={{ marginLeft: '10px' }}></i> {hotel.city}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/tabs/${hotel.hotelId}`} className="btn btn-primary">
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(hotel.hotelId)}
                    >
                      <i className="fas fa-trash-alt"></i> Apagar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Nenhum hotel encontrado.</p>
          </div>
        )}
      </div>
      <Pagination className="justify-content-center mt-4">
        {pageNumbers.map((pageNumber) => (
          <Pagination.Item
            key={`page-${pageNumber}`}
            active={pageNumber === currentPage}
            onClick={() => paginate(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default HotelListTemplate;
