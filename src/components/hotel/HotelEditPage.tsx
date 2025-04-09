import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HotelTabs from './HotelTabs';
import '../../css/HotelEditPage.css'; // Adicione um arquivo CSS para estilos personalizados
import EnvironmentService from '../../services/general/EnvironmentService';
import { IHotel } from '../../interfaces/model/Hotel/IHotel';
import HotelService from '../../services//hotel/hotelService';

const HotelEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotelId, setHotelId] = useState<number | null>(null);
  const [hotel, setHotel] = useState<IHotel | null>(null);

  useEffect(() => {
    if (id) {
      setHotelId(parseInt(id, 10));
    } else {
      setHotelId(null);
    }
    const fetchHotel = async () => {
      try {
        const _hotel = await HotelService.getById(Number(hotelId)); // Fetch by ID
        setHotel(_hotel.data);
      } catch (error) {
        if (EnvironmentService.isNotTestEnvironment()) {
          console.error('Fetch Hotel Error:', error);
        }
      }
    };
    fetchHotel();
  }, [id]);

  return (
    <Container fluid className="hotel-edit-container p-0">
      <div className="full-height-tabs">
        <HotelTabs hotelId={hotelId} hotel={hotel} />
      </div>
    </Container>
  );
};
export default HotelEditPage;