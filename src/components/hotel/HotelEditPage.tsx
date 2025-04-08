import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';  
import HotelTabs from './HotelTabs';
import '../../css/HotelEditPage.css'; // Adicione um arquivo CSS para estilos personalizados

const HotelEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [hotelId, setHotelId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      setHotelId(parseInt(id, 10));
    } else {
      setHotelId(null);
    }
  }, [id]);

  return (
    <Container fluid className="hotel-edit-container p-0"> 
      <div className="full-height-tabs">
        <HotelTabs hotelId={hotelId} />
      </div>
    </Container>
  );
};

export default HotelEditPage;
