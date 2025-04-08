import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { IRoom } from '../../interfaces/model/Hotel/IRoom';
import { RoomStatus } from '../../enums/hotel/RoomStatus';
import { RoomType } from '../../enums/hotel/RoomType';
import RoomService from '../../services/hotel/RoomService';
import { RoomFormProps } from '../../interfaces/DTO/Hotel/IHotelProps';
 
const RoomForm: React.FC<RoomFormProps> = ({ hotelId, room, onClose }) => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState<IRoom>({
    id: 0,
    hotelId: hotelId,
    roomType: RoomType.Single,
    capacity: 1,
    description: '',
    status: RoomStatus.Available,
    minimumNights: 1
  });

  useEffect(() => {
    if (room) {
      setFormData(room);
    } else {
      setFormData({
        id: 0,
        hotelId: hotelId,
        roomType: RoomType.Single,
        capacity: 1,
        description: '',
        status: RoomStatus.Available,
        minimumNights: 1
      });
    }
  }, [room, hotelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomType' || name === 'status' || name === 'capacity' || name === 'minimumNights' 
        ? parseInt(value, 10) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      let response;

      console.log('Form Data:', formData);  
      if (formData.id === 0) {
        response = await RoomService.create(formData);
      } else {
        response = await RoomService.update(formData.id, formData);
      }

      if (response.success) {
        onClose();
      } else {
        alert(`Erro: ${response.message}`);
      }
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
      alert('Ocorreu um erro ao salvar o quarto.');
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{formData.id === 0 ? 'Adicionar Quarto' : 'Editar Quarto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Tipo de Quarto</Form.Label>
              <Form.Select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
              >
                <option value={RoomType.Single}>Individual</option>
                <option value={RoomType.Double}>Duplo</option>
                <option value={RoomType.Suite}>Suíte</option> 
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecione o tipo de quarto.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value={RoomStatus.Available}>Disponível</option>
                <option value={RoomStatus.Occupied}>Ocupado</option>
                <option value={RoomStatus.Maintenance}>Manutenção</option>
                <option value={RoomStatus.Cleaning}>Limpeza</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecione o status do quarto.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Capacidade</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
              />
              <Form.Control.Feedback type="invalid">
                Informe a capacidade do quarto.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Mínimo de Noites</Form.Label>
              <Form.Control
                type="number"
                name="minimumNights"
                value={formData.minimumNights}
                onChange={handleChange}
                min="1"
                required
              />
              <Form.Control.Feedback type="invalid">
                Informe o mínimo de noites.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Informe a descrição do quarto.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoomForm;
