import React, { useState, useEffect } from 'react';
import '../../css/HotelFormTemplate.css';
import { FaPlusCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 
import { v4 as uuidv4 } from 'uuid';
import { IHotelFormTemplateProps } from '../../interfaces/DTO/Hotel/IHotelFormTemplateProps';

const HotelFormTemplate: React.FC<IHotelFormTemplateProps> = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  handleAutoFill,
  handleAddToVectorStore,
  setFormData,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<{ id: string, value: string }[]>(formData.tags.map(tag => ({ id: uuidv4(), value: tag })));

  useEffect(() => {
    setTags(formData.tags.map(tag => ({ id: uuidv4(), value: tag })));
  }, [formData.tags]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.some(tag => tag.value === tagInput.trim())) {
      const newTags = [...tags, { id: uuidv4(), value: tagInput.trim() }];
      setTags(newTags);
      setFormData({ ...formData, tags: newTags.map(tag => tag.value) });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const newTags = tags.filter(t => t.id !== tagId);
    setTags(newTags);
    setFormData({ ...formData, tags: newTags.map(tag => tag.value) });
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">{formData.hotelId ? 'Editar Hotel' : 'Adicionar Hotel'}</h2>
      <form onSubmit={handleSubmit}>
        {!formData.hotelId && (
          <div className="d-flex mb-3">
            <button type="button" className="btn btn-info" onClick={handleAutoFill}>Auto Preencher (IA)</button>
          </div>
        )}
        {formData && formData.hotelId > 0 && (
          <div className="d-flex mb-3 align-items-center">
            {formData.isHotelInVectorStore ? (
              <FaCheckCircle className="text-success" />
            ) : (
              <FaTimesCircle className="text-danger" />
            )}
            <span className="ms-2">{formData.isHotelInVectorStore ? 'No Vector Store' : 'Not in Vector Store'}</span>
            {!formData.isHotelInVectorStore && (
              <button type="button" className="btn btn-link ms-2" onClick={handleAddToVectorStore}>
                <FaPlusCircle className="text-primary" />
              </button>
            )}
          </div>
        )}
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
            <div className="d-flex">
              <input type="text" className="form-control me-2" id="tags" value={tagInput} onChange={handleTagInputChange} />
              <button type="button" className="btn btn-primary" onClick={handleAddTag}>Adicionar</button>
            </div>
            <div className="mt-2">
              {tags.map((tag) => (
                <span key={tag.id} className="badge bg-success me-2">
                  {tag.value} <button type="button" className="btn-close btn-close-white ms-1" onClick={() => handleRemoveTag(tag.id)}></button>
                </span>
              ))}
            </div>
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
