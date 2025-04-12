import React, { useEffect, useState } from 'react';
import { Button, Form, Col, Row, Table, Spinner } from 'react-bootstrap';
import { RoomAvailabilityManagementTemplateProps } from '../../interfaces/DTO/Hotel/IHotelProps';
import DatePicker from 'react-date-picker';
import { Value } from 'react-calendar/dist/esm/shared/types.js';
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-picker/dist/DatePicker.css';
import '../../css/datepicker.css'; // Add this line 
import { parseDate } from '../../helpers/dateHelper';
 
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
  onPriceChange,
  onSave,
  onCancel,
  onSearch,
  searchCurrency,
  onSearchCurrencyChange
}) => {
  // Estado para rastrear se as datas foram alteradas
  const [datesModified, setDatesModified] = useState<boolean>(false);
  
  // Atualiza o estado quando as datas mudam
  useEffect(() => {
    if (startDate || endDate) {
      setDatesModified(true);
    }
  }, [startDate, endDate]);

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

  // Get the current currency symbol
  const currentCurrencySymbol = currencies.find(c => c.code === searchCurrency)?.symbol || '';

  return (
    <div>
      <h3 className="mb-0">Cadastro de Disponibilidade de Quartos - {hotel?.hotelName}</h3>
      <Row className="mb-4">
       <Col md={3}>
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
        <Col md={3}>
          <Form.Group>
            <Form.Label>Data Final <span className="text-danger">*</span></Form.Label>
            <div>
              <DatePicker
                value={parseDate(endDate)}
                onChange={handleEndDateChange}
                format="dd/MM/yyyy"
                className={formErrors.endDate ? 'is-invalid' : ''}
              />
              {formErrors.endDate && (
                <div className="invalid-feedback d-block">{formErrors.endDate}</div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Moeda <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={searchCurrency}
              onChange={(e) => onSearchCurrencyChange(e.target.value)}
              className={formErrors.searchCurrency ? 'is-invalid' : ''}
            >
              <option value="">Selecione</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.symbol} - {currency.name}
                </option>
              ))}
            </Form.Select>
            {formErrors.searchCurrency && (
              <div className="invalid-feedback">{formErrors.searchCurrency}</div>
            )}
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button 
            variant="primary" 
            onClick={onSearch}
            disabled={isLoading}
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

      {/* Só exibe o erro de intervalo de datas se as datas foram modificadas */}
      {datesModified && formErrors.dateRange && (
        <div className="alert alert-danger">{formErrors.dateRange}</div>
      )}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Quarto</th>
              <th>Quantidade</th>
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
                    onChange={(e) => onQuantityChange(room.id, parseInt(e.target.value) || 0)}
                    className={formErrors[`room_${room.id}_quantity`] ? 'is-invalid' : ''}
                  />
                  {formErrors[`room_${room.id}_quantity`] && (
                    <div className="invalid-feedback">{formErrors[`room_${room.id}_quantity`]}</div>
                  )}
                </td>
                {weekDays.map((day) => (
                  <td key={`${room.id}_${day}`}>
                    <div className="input-group">
                      <span className="input-group-text">
                        {currentCurrencySymbol}
                      </span>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={room.prices[day] || 0}
                        onChange={(e) => onPriceChange(room.id, day, parseFloat(e.target.value) || 0)}
                        className={formErrors[`room_${room.id}_price_${day}`] ? 'is-invalid' : ''}
                      />
                      {formErrors[`room_${room.id}_price_${day}`] && (
                        <div className="invalid-feedback">{formErrors[`room_${room.id}_price_${day}`]}</div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={onSave} 
          disabled={!isSaveEnabled || isLoading}
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
    </div>
  );
};

export default RoomAvailabilityManagementTemplate;
