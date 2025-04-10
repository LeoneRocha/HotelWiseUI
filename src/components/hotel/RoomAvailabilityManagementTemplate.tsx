import React, { useEffect } from 'react';
import { Button, Form, Col, Row, Table } from 'react-bootstrap';
import { RoomAvailabilityManagementTemplateProps } from '../../interfaces/DTO/Hotel/IHotelProps';
import DatePicker from 'react-date-picker';
import { Value } from 'react-calendar/dist/esm/shared/types.js';
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-picker/dist/DatePicker.css';
import '../../css/datepicker.css'; // Add this line 
import { parseDate, parseDateNull } from '../../helpers/dateHelper';

const RoomAvailabilityManagementTemplate: React.FC<RoomAvailabilityManagementTemplateProps> = ({
  startDate,
  endDate,
  rooms,
  currencies,
  weekDays,
  isLoading,
  hotel,
  onStartDateChange,
  onEndDateChange,
  onQuantityChange,
  onCurrencyChange,
  onPriceChange,
  onSave,
  onCancel
}) => {


  useEffect(() => {
    console.log('hotel', hotel);
  }, [hotel]);

  // Handle date changes with the correct type
  const handleStartDateChange = (value: Value) => {
    // Check if value is a Date object
    const date = value instanceof Date ? value : null;
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    onStartDateChange(formattedDate);
  };

  const handleEndDateChange = (value: Value) => {
    // Check if value is a Date object
    const date = value instanceof Date ? value : null;
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    onEndDateChange(formattedDate);
  };

  return (
    <div>
      <h3 className="mb-0">Cadastro de Disponibilidade de Quartos - {hotel?.hotelName}</h3>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Data Inicial</Form.Label>
            <div>
              <DatePicker
                value={parseDate(startDate)}
                onChange={handleStartDateChange}
                format="dd/MM/yyyy"
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Data Final</Form.Label>
            <div>
              <DatePicker
                value={parseDate(endDate)}
                onChange={handleEndDateChange}
                format="dd/MM/yyyy"
                minDate={parseDateNull(startDate)} // Agora retorna "Date | undefined"                

              />
            </div>
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
    </div>
  );
};

export default RoomAvailabilityManagementTemplate;
