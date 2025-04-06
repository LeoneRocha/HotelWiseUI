import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HotelService from '../services//hotel/hotelService';
import { IHotel } from '../interfaces/IHotel';
import HotelFormTemplate from './HotelFormTemplate';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IHotelFormProps } from '../interfaces/IHotelFormProps';
import EnvironmentService from '../services/general/EnvironmentService';

const initialFormData: IHotel = {
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
  isHotelInVectorStore: false,
};

const HotelForm: React.FC<IHotelFormProps> = ({ onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IHotel>(initialFormData);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'success' | 'danger' | null>(null);
  const isFetching = useRef(false); // Prevents duplicate API calls
  const [countdown, setCountdown] = useState(10); // Countdown state for redirect

  useEffect(() => {
    if (id === 'new') {
      setFormData(initialFormData); // Clears the form
    } else if (id && !isNaN(Number(id)) && !isFetching.current) {
      isFetching.current = true;
      const fetchHotel = async () => {
        try {
          const hotel = await HotelService.getById(Number(id)); // Fetch by ID
          setFormData(hotel);
        } catch (error) {
          if (EnvironmentService.isNotTestEnvironment()) {
            console.error('Fetch Hotel Error:', error);
          }
          setModalMessage('Erro ao buscar dados do hotel. Por favor, tente novamente.');
          setModalType('danger');
          setShowModal(true);
        } finally {
          isFetching.current = false;
        }
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
    try {
      if (formData.hotelId === 0) {
        await HotelService.create(formData); // Create hotel using generic method
        setModalMessage('Hotel criado com sucesso!');
        setModalType('success');
      } else {
        await HotelService.update(formData.hotelId, formData); // Update hotel using generic method
        setModalMessage('Hotel atualizado com sucesso!');
        setModalType('success');
      }
      setShowModal(true);
      onSave();
    } catch (error) {
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Submit Hotel Error:', error);
      }
      setModalMessage('Ocorreu um erro ao salvar o hotel. Por favor, tente novamente.');
      setModalType('danger');
      setShowModal(true);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (modalType === 'success' && formData.hotelId === 0) {
      const countdownInterval = setInterval(() => setCountdown((prev) => prev - 1), 1000);

      timer = setTimeout(() => navigate('/list'), 10000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [modalType, formData.hotelId, navigate]);

  const handleCancel = () => navigate('/list');

  const handleAutoFill = async () => {
    try {
      const generatedHotel = await HotelService.generateHotelByIA(); // Generate hotel by IA
      setFormData(generatedHotel);
    } catch (error) {
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Generate Hotel Error:', error);
      }
      setModalMessage('Erro ao gerar dados do hotel. Por favor, tente novamente.');
      setModalType('danger');
      setShowModal(true);
    }
  };

  const handleAddToVectorStore = async () => {
    try {
      if (formData.hotelId > 0) {
        await HotelService.addVectorById(formData.hotelId); // Add hotel to vector store
        navigate('/list');
      }
    } catch (error) {      
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Add to Vector Store Error:', error);
      }
      setModalMessage('Erro ao gravar no vetor. Por favor, tente novamente.');
      setModalType('danger');
      setShowModal(true);
    }
  };

  return (
    <div>
      <HotelFormTemplate
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        setFormData={setFormData}
        handleAutoFill={handleAutoFill}
        handleAddToVectorStore={handleAddToVectorStore}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'success' ? 'Sucesso' : 'Erro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
          {modalType === 'success' && formData.hotelId === 0 && (
            <p>Redirecionando em {countdown} segundos...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HotelForm;
