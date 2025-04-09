import React from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { RoomStatus, RoomStatusDescriptions } from '../../enums/hotel/RoomStatus';
import { RoomType, RoomTypeDescriptions } from '../../enums/hotel/RoomType';
import { RoomFormTemplateProps } from '../../interfaces/DTO/Hotel/IHotelProps'; 
import EnumSelect from '../general/EnumSelect';

const RoomFormTemplate: React.FC<RoomFormTemplateProps> = ({
  formData,
  validated,
  onClose,
  onChange,
  onSubmit
}) => {
  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{formData.id === 0 ? 'Adicionar Quarto' : 'Editar Quarto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Row className="mb-3">
            <Col md="6">
              <EnumSelect
                enumObject={RoomType}
                name="roomType"
                value={formData.roomType}
                onChange={onChange}
                descriptionsMap={RoomTypeDescriptions}
                label="Tipo de Quarto"
                required
                invalidFeedback="Selecione o tipo de quarto."
              />
            </Col>

            <Col md="6">
              <EnumSelect
                enumObject={RoomStatus}
                name="status"
                value={formData.status}
                onChange={onChange}
                descriptionsMap={RoomStatusDescriptions}
                label="Status"
                required
                invalidFeedback="Selecione o status do quarto."
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Capacidade</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={onChange}
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
                onChange={onChange}
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
              onChange={onChange}
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

export default RoomFormTemplate;
