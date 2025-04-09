import React, { useState, useEffect } from 'react';
import { IRoom } from '../../interfaces/model/Hotel/IRoom';
import { RoomStatus } from '../../enums/hotel/RoomStatus';
import { RoomType } from '../../enums/hotel/RoomType';
import RoomService from '../../services/hotel/RoomService';
import { RoomFormProps } from '../../interfaces/DTO/Hotel/IHotelProps';
import RoomFormTemplate from './RoomFormTemplate';

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
    <RoomFormTemplate
      formData={formData}
      validated={validated}
      onClose={onClose}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default RoomForm;
