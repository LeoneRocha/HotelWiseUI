import React, { useEffect, useState } from 'react';
import { useParams  } from 'react-router-dom';
import { Container, Card, Breadcrumb } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import HotelTabs from './HotelTabs';

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
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/hotels" }}>Hotéis</Breadcrumb.Item>
        <Breadcrumb.Item active>{id ? 'Editar Hotel' : 'Novo Hotel'}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Card.Header>
          <h2>{id ? 'Editar Hotel' : 'Novo Hotel'}</h2>
        </Card.Header>
        <Card.Body>
          <HotelTabs hotelId={hotelId} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HotelEditPage;