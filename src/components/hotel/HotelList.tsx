import React, { useEffect, useState, useRef, useCallback } from 'react';
import HotelService from '../../services/hotel/hotelService';
import HotelListTemplate from './HotelListTemplate';
import { IHotel } from '../../interfaces/model/Hotel/IHotel';
import { ISyncFeedback } from '../../interfaces/DTO/Hotel/IHotelListTemplateProps';
import EnvironmentService from '../../services/general/EnvironmentService';
import { extractErrorInfo } from '../../utils/errorUtils';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<IHotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<ISyncFeedback | null>(null);
  const isFetching = useRef(false);

  const fetchHotels = useCallback(async () => {
    try {
      setError(null);
      setErrorDetails(null);
      const response = await HotelService.getAll();
      if (response.success) {
        setHotels(response.data);
        setFilteredHotels(response.data);
      } else {
        const info = extractErrorInfo(response, 'Ocorreu um erro ao buscar os hotéis.');
        setError(info.userMessage);
        setErrorDetails(info.technicalDetails || null);
      }
    } catch (err) {
      const info = extractErrorInfo(err, 'Ocorreu um erro ao buscar os hotéis.');
      setError(info.userMessage);
      setErrorDetails(info.technicalDetails || null);
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Erro ao buscar hotéis:', err);
      }
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true;
      fetchHotels();
    }
  }, [fetchHotels]);

  const handleDelete = async (id: number) => {
    try {
      const response = await HotelService.delete(id);
      if (response.success) {
        setHotels(hotels.filter(hotel => hotel.hotelId !== id));
        setFilteredHotels(filteredHotels.filter(hotel => hotel.hotelId !== id));
      } else {
        const info = extractErrorInfo(response, 'Ocorreu um erro ao excluir o hotel.');
        setError(info.userMessage);
        setErrorDetails(info.technicalDetails || null);
      }
    } catch (err) {
      const info = extractErrorInfo(err, 'Ocorreu um erro ao excluir o hotel.');
      setError(info.userMessage);
      setErrorDetails(info.technicalDetails || null);
    }
  };

  const handleSyncAllToVectorStore = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const response = await HotelService.syncAllToVectorStore();
      if (response.success && response.data) {
        setSyncFeedback({
          message: response.message || `Sincronização concluída com sucesso (${response.data.synchronizedCount} hotéis indexados no vetor).`,
          type: 'success',
          details: response.data.errors && response.data.errors.length > 0 ? response.data.errors : undefined,
        });
      } else {
        const errorMsg = response.message || 'Falha ao sincronizar hotéis no vetor.';
        setSyncFeedback({
          message: errorMsg,
          type: response.data && response.data.synchronizedCount > 0 ? 'warning' : 'danger',
          details: response.data?.errors,
        });
      }
      await fetchHotels();
    } catch (err) {
      const info = extractErrorInfo(err, 'Erro ao sincronizar hotéis no vetor.');
      setSyncFeedback({
        message: info.userMessage,
        type: 'danger',
        details: info.technicalDetails ? [info.technicalDetails] : undefined,
      });
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Erro ao sincronizar hotéis no vetor:', err);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue);
    if (filterValue === '') {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter(hotel =>
        hotel.hotelName.toLowerCase().includes(filterValue.toLowerCase()) || hotel.city.toLowerCase().includes(filterValue.toLowerCase())
      ));
    }
    setCurrentPage(1);
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {error && (
        <div role="alert" className="alert alert-danger mx-3 mt-3 shadow-sm">
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                <i className="fas fa-exclamation-triangle me-2 text-danger"></i>
                <strong>{error}</strong>
              </div>
              {errorDetails && (
                <div className="mt-2 p-2 bg-white bg-opacity-75 rounded border border-danger text-dark small font-monospace">
                  {errorDetails}
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm ms-3 text-nowrap"
              onClick={fetchHotels}
            >
              <i className="fas fa-redo-alt me-1"></i> Tentar novamente
            </button>
          </div>
        </div>
      )}
      <HotelListTemplate
        hotels={currentHotels}
        totalHotels={filteredHotels.length}
        currentPage={currentPage}
        hotelsPerPage={hotelsPerPage}
        handleDelete={handleDelete}
        paginate={paginate}
        filter={filter}
        handleFilterChange={handleFilterChange}
        handleSyncAllToVectorStore={handleSyncAllToVectorStore}
        isSyncing={isSyncing}
        syncFeedback={syncFeedback}
        onDismissSyncFeedback={() => setSyncFeedback(null)}
        onRetry={fetchHotels}
      />
    </div>
  );
};

export default HotelList;

