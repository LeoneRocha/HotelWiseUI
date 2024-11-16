import React from 'react';
import { IHotel } from '../interfaces/IHotel';

interface HotelFormTemplateProps {
  formData: IHotel;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const HotelFormTemplate: React.FC<HotelFormTemplateProps> = ({ formData, handleChange, handleSubmit, handleCancel }) => {
  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">{formData.hotelId ? 'Editar Hotel' : 'Adicionar Hotel'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="hotelName" className="form-label">Nome do Hotel</label>
            <input type="text" className="form-control" id="hotelName" name="hotelName" value={formData.hotelName} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="description" className="form-label">Descrição</label>
            <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input type="text" className="form-control" id="tags" name="tags" value={formData.tags.join(', ')} onChange={(e) => handleChange(e as any)} />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="stars" className="form-label">Estrelas</label>
            <input type="number" className="form-control" id="stars" name="stars" value={formData.stars} onChange={handleChange} min="1" max="5" required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="initialRoomPrice" className="form-label">Preço Inicial do Quarto</label>
            <input type="number" className="form-control" id="initialRoomPrice" name="initialRoomPrice" value={formData.initialRoomPrice} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="zipCode" className="form-label">CEP</label>
            <input type="text" className="form-control" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="location" className="form-label">Localização</label>
            <input type="text" className="form-control" id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="city" className="form-label">Cidade</label>
            <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="stateCode" className="form-label">Estado</label>
            <input type="text" className="form-control" id="stateCode" name="stateCode" value={formData.stateCode} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="score" className="form-label">Pontuação</label>
            <input type="number" className="form-control" id="score" name="score" value={formData.score} onChange={handleChange} required />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary w-49" onClick={handleCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary w-49">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default HotelFormTemplate;
