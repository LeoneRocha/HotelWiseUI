import React  from 'react';
import { Button, Form, Col, Row, Table, Spinner } from 'react-bootstrap';
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
  formErrors,
  isSaveEnabled,
  onStartDateChange,
  onEndDateChange,
  onQuantityChange,
  onCurrencyChange,
  onPriceChange,
  onSave,
  onCancel,
  onSearch
}) => {
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
        <Col md={5}>
          <Form.Group>
            <Form.Label>Data Inicial <span className="text-danger">*</span></Form.Label>
            <div>
              <DatePicker
                value={parseDate(startDate)}
                onChange={handleStartDateChange}
                format="dd/MM/yyyy"
                className={formErrors.startDate ? 'is-invalid' : ''}
              />
              {formErrors.startDate && (
                <div className="invalid-feedback d-block">{formErrors.startDate}</div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Data Final <span className="text-danger">*</span></Form.Label>
            <div>
              <DatePicker
                value={parseDate(endDate)}
                onChange={handleEndDateChange}
                format="dd/MM/yyyy"
                minDate={parseDateNull(startDate)}
                className={formErrors.endDate ? 'is-invalid' : ''}
              />
              {formErrors.endDate && (
                <div className="invalid-feedback d-block">{formErrors.endDate}</div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button 
            variant="primary" 
            onClick={onSearch} 
            disabled={isLoading || !startDate || !endDate}
            className="w-100"
          >
            {isLoading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              'Buscar'
            )}
          </Button>
        </Col>
      </Row>

      {formErrors.dateRange && (
        <div className="alert alert-danger mb-3">{formErrors.dateRange}</div>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Quarto</th>
            <th>Quantidade <span className="text-danger">*</span></th>
            <th>Moeda <span className="text-danger">*</span></th>
            {weekDays.map(day => (
              <th key={day}>{day} <span className="text-danger">*</span></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  value={room.quantity}
                  onChange={e => onQuantityChange(room.id, parseInt(e.target.value) || 0)}
                  className={formErrors[`room_${room.id}_quantity`] ? 'is-invalid' : ''}
                />
                {formErrors[`room_${room.id}_quantity`] && (
                  <div className="invalid-feedback">{formErrors[`room_${room.id}_quantity`]}</div>
                )}
              </td>
              <td>
                <Form.Control
                  as="select"
                  value={room.currency}
                  onChange={e => onCurrencyChange(room.id, e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Form.Control>
              </td>
              {weekDays.map(day => (
                <td key={day}>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={room.prices[day]}
                    onChange={e => onPriceChange(room.id, day, parseFloat(e.target.value) || 0)}
                    className={formErrors[`room_${room.id}_price_${day}`] ? 'is-invalid' : ''}
                  />
                  {formErrors[`room_${room.id}_price_${day}`] && (
                    <div className="invalid-feedback">{formErrors[`room_${room.id}_price_${day}`]}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={onSave} 
          disabled={isLoading || !isSaveEnabled}
        >
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Salvando...</span>
            </>
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
      
      {!isSaveEnabled && startDate && endDate && rooms.length > 0 && (
        <div className="alert alert-warning mt-3">
          Para salvar, preencha a quantidade e os preços para pelo menos um quarto.
        </div>
      )}
    </div>
  );
};

export default RoomAvailabilityManagementTemplate;
