import React from 'react'; 
import { Button, Form, Col, Card, Row, Table } from 'react-bootstrap';

interface RoomAvailabilityManagementTemplateProps {
  startDate: string;
  endDate: string;
  rooms: Array<{
    id: number;
    name: string;
    quantity: number;
    currency: string;
    prices: {
      [key: string]: number;
    };
  }>;
  currencies: string[];
  weekDays: string[];
  isLoading: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onQuantityChange: (roomId: number, quantity: number) => void;
  onCurrencyChange: (roomId: number, currency: string) => void;
  onPriceChange: (roomId: number, day: string, price: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const RoomAvailabilityManagementTemplate: React.FC<RoomAvailabilityManagementTemplateProps> = ({
  startDate,
  endDate,
  rooms,
  currencies,
  weekDays,
  isLoading,
  onStartDateChange,
  onEndDateChange,
  onQuantityChange,
  onCurrencyChange,
  onPriceChange,
  onSave,
  onCancel
}) => {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Cadastro de Disponibilidade de Quartos</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Data Inicial</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Data Final</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Quarto</th>
                <th>Quantidade Por Dia</th>
                <th>Moeda</th>
                {weekDays.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      value={room.quantity}
                      onChange={(e) => onQuantityChange(room.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={room.currency}
                      onChange={(e) => onCurrencyChange(room.id, e.target.value)}
                    >
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  {weekDays.map((day) => (
                    <td key={`${room.id}-${day}`}>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={room.prices[day] || 0}
                        onChange={(e) => onPriceChange(room.id, day, parseFloat(e.target.value))}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <Button 
            variant="secondary" 
            className="me-2" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={onSave} 
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoomAvailabilityManagementTemplate;
