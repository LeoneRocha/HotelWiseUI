import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, createHotel, updateHotel } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';

interface HotelFormProps {
  onSave: () => void;
}

const HotelForm: React.FC<HotelFormProps> = ({ onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IHotel>({
    hotelId: 0,
    hotelName: '',
    description: '',
    tags: [],
    stars: 0,
    initialRoomPrice: 0,
    zipCode: '',
    location: '',
    city: '',
    stateCode: '',
    score: 0,
  });

  useEffect(() => {
    if (id) {
      const fetchHotel = async () => {
        const hotel = await getHotelById(Number(id));
        setFormData(hotel);
      };
      fetchHotel();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.hotelId === 0) {
      await createHotel(formData);
    } else {
      await updateHotel(formData.hotelId, formData);
    }
    onSave();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="hotelName" className="form-label">Nome do Hotel</label>
        <input type="text" className="form-control" id="hotelName" name="hotelName" value={formData.hotelName} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descrição</label>
        <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      {/* Adicione outros campos conforme necessário */}
      <button type="submit" className="btn btn-primary">Salvar</button>
    </form>
  );
};

export default HotelForm;
