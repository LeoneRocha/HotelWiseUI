import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container } from 'react-bootstrap';
import HotelTabs from './HotelTabs';
import '../../css/HotelEditPage.css'; // Adicione um arquivo CSS para estilos personalizados
import EnvironmentService from '../../services/general/EnvironmentService';
import { IHotel } from '../../interfaces/model/Hotel/IHotel';
import HotelService from '../../services//hotel/hotelService';

const HotelEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hotelId = id && !isNaN(Number(id)) ? Number(id) : null;
  const [hotel, setHotel] = useState<IHotel | null>(null);

  useEffect(() => {
    if (hotelId == null) {
      return;
    }

    let cancelled = false;
    const fetchHotel = async () => {
      try {
        const _hotel = await HotelService.getById(hotelId);
        if (!cancelled) {
          setHotel(_hotel.data);
        }
      } catch (error) {
        if (EnvironmentService.isNotTestEnvironment()) {
          console.error('Fetch Hotel Error:', error);
        }
      }
    };
    fetchHotel();

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return (
    <Container fluid className="p-0">
      <div className="full-height-tabs">
        <HotelTabs hotelId={hotelId} hotel={hotel} />
      </div>
    </Container>
  );
};
export default HotelEditPage;
