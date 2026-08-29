import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Container, Spinner } from 'react-bootstrap';
import HotelTabs from './HotelTabs';
import '../../css/HotelEditPage.css';
import EnvironmentService from '../../services/general/EnvironmentService';
import { IHotel } from '../../interfaces/model/Hotel/IHotel';
import HotelService from '../../services//hotel/hotelService';

const HotelEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hotelId = id && !Number.isNaN(Number(id)) ? Number(id) : null;
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState(hotelId != null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hotelId == null) {
      setLoading(false);
      setError('Identificador de hotel inválido.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchHotel = async () => {
      try {
        const _hotel = await HotelService.getById(hotelId);
        if (!cancelled) {
          if (_hotel?.data) {
            setHotel(_hotel.data);
            setError(null);
          } else {
            setHotel(null);
            setError('Hotel não encontrado.');
          }
        }
      } catch (err) {
        if (EnvironmentService.isNotTestEnvironment()) {
          console.error('Fetch Hotel Error:', err);
        }
        if (!cancelled) {
          setHotel(null);
          setError('Erro ao buscar dados do hotel. Verifique se a API está disponível e se o hotel existe.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchHotel();

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  if (loading) {
    return (
      <Container fluid className="p-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3 mb-0">Carregando hotel...</p>
      </Container>
    );
  }

  if (error && !hotel) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <div className="full-height-tabs">
        <HotelTabs hotelId={hotelId} hotel={hotel} />
      </div>
    </Container>
  );
};
export default HotelEditPage;
