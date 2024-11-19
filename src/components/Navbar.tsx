import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/Navbar.css'; // Importando o CSS customizado
import { getChatCompletion } from '../services/chatService';

const Navbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await getChatCompletion({ maxHotelRetrieve: 0, searchTextCriteria: query });
      if (res.length > 0) {
        setResponse(res[0].response);
      } else {
        setResponse('Nenhuma resposta encontrada.');
      }
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao consultar a API de chat completion:', error);
      setResponse('Ocorreu um erro ao consultar a API. Por favor, tente novamente.');
      setShowModal(true);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/list">Hotel Management</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/search">Buscar Hotéis</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Admin
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/edit/new">Adicionar Hotel</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/list">Listar Hotéis</Link></li>
              </ul>
            </li>
          </ul>
          <form className="d-flex assistant-search-form" onSubmit={handleSubmit}>
            <input
              className="form-control me-2 assistant-search-input"
              type="search"
              placeholder="Pergunte ao Assistente..."
              aria-label="Search"
              value={query}
              onChange={handleInputChange}
            />
            <button className="btn btn-success" type="submit">Enviar</button>
          </form>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Resposta do Assistente</Modal.Title>
        </Modal.Header>
        <Modal.Body>{response}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
};

export default Navbar;
