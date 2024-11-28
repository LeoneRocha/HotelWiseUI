import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatCompletion } from '../services/assistantService';
import LocalStorageService from '../services/localStorageService';
import DOMPurify from 'dompurify';
import { EnvironmentService } from '../services/EnvironmentService';
import NavbarTemplate from './NavbarTemplate';

const Navbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await getChatCompletion({ maxHotelRetrieve: 0, searchTextCriteria: query });
      if (res.length > 0) {
        const sanitizedResponse = DOMPurify.sanitize(res[0].response);
        setResponse(sanitizedResponse);
      } else {
        setResponse('Nenhuma resposta encontrada.');
      }
      setShowModal(true);
    } catch (error) {
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Erro ao consultar a API de chat completion:', error);
      }
      setResponse('Ocorreu um erro ao consultar a API. Por favor, tente novamente.');
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    LocalStorageService.removeItem('token');
    navigate('/login');
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutClose = () => {
    setShowLogoutModal(false);
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    setShowLogoutModal(false);
  };

  return (
    <NavbarTemplate
      query={query}
      response={response}
      showModal={showModal}
      showLogoutModal={showLogoutModal}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      confirmLogout={confirmLogout}
      handleLogoutClose={handleLogoutClose}
      handleLogoutConfirm={handleLogoutConfirm}
      setShowModal={setShowModal}
    />
  );
};

export default Navbar;