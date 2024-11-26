import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FiLogOut } from 'react-icons/fi';
import '../css/Navbar.css';
import { NavbarProps } from '../interfaces/NavbarProps';

const NavbarTemplate: React.FC<NavbarProps> = ({
  query,
  response,
  showModal,
  showLogoutModal,
  handleInputChange,
  handleSubmit,
  confirmLogout,
  handleLogoutClose,
  handleLogoutConfirm,
  setShowModal,
}) => (
  <div className="container-fluid bg-dark">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
              <li><Link className="dropdown-item" to="/new/:new">Adicionar Hotel</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/list">Listar Hotéis</Link></li>
            </ul>
          </li>
        </ul>
        <button className="btn btn-link text-white ms-3" onClick={confirmLogout}>
          <FiLogOut size={24} title='Logout' />
        </button>
      </div>
    </nav>
    <div className="container-fluid bg-dark mt-3 mb-3 assistant-search-form " >
      <form className="d-flex flex-column flex-md-row assistant-search-form" onSubmit={handleSubmit}>
        <input
          className="form-control me-md-2 assistant-search-input"
          type="search"
          placeholder="Pergunte ao Assistente..."
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
        />
        <button className="btn btn-success mt-2 mt-md-0 ms-md-2" type="submit">Enviar</button>
      </form>
    </div>
    <div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Resposta do Assistente</Modal.Title>
        </Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={{ __html: response }}></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLogoutModal} onHide={handleLogoutClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você deseja deslogar do sistema?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleLogoutConfirm}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  </div>
);

export default NavbarTemplate;
