import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, createHotel, updateHotel, generateHotelByIA, adVectorById } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';
import HotelFormTemplate from './HotelFormTemplate';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { HotelFormProps } from '../interfaces/HotelFormProps';

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

const HotelForm: React.FC<HotelFormProps> = ({ onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IHotel>(initialFormData);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'success' | 'danger' | null>(null);
  const isFetching = useRef(false);  // Usado para evitar chamadas duplicadas à API
  const [countdown, setCountdown] = useState(10); // Estado para a contagem regressiva

  useEffect(() => {
    if (id === 'new') {
      // Limpar os campos do formulário
      setFormData(initialFormData);
    } else if (id && !isNaN(Number(id)) && !isFetching.current) {
      isFetching.current = true;
      const fetchHotel = async () => {
        try {
          const hotel = await getHotelById(Number(id));
          setFormData(hotel);
        } catch (error) {
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
        await createHotel(formData);
        setModalMessage('Hotel criado com sucesso!');
        setModalType('success');
        setShowModal(true);
      } else {
        await updateHotel(formData.hotelId, formData);
        setModalMessage('Hotel atualizado com sucesso!');
        setModalType('success');
        setShowModal(true);
      }
      onSave();
    } catch (error) {
      setModalMessage('Ocorreu um erro ao salvar o hotel. Por favor, tente novamente.');
      setModalType('danger');
      setShowModal(true);
    }
  };

  // Efetuar o redirecionamento após a contagem regressiva - Usar useEffect para gerenciar um timeout e evitar vazamento de memória
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (modalType === 'success' && formData.hotelId === 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      
      timer = setTimeout(() => {
        navigate('/list');
      }, 10000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [modalType, formData.hotelId, navigate]);

  const handleCancel = () => {
    navigate('/list');
  };

  const handleAutoFill = async () => {
    try {
      const generatedHotel = await generateHotelByIA();
      setFormData(generatedHotel);
    } catch (error) {
      setModalMessage('Erro ao gerar dados do hotel. Por favor, tente novamente.');
      setModalType('danger');
      setShowModal(true);
    }
  };

  const handleAddToVectorStore = async () => {
    try {
      if (formData.hotelId > 0) {
        await adVectorById(formData.hotelId);
        navigate('/list');
      }
    } catch (error) {
      setModalMessage('Erro ao gravar no vetor. Por favor, tente novamente.');
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
