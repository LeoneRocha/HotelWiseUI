import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FiLogOut } from 'react-icons/fi';
import '../../css/Navbar.css';
import { INavbarProps } from '../../interfaces/DTO/INavbarProps';

const NavbarTemplate: React.FC<INavbarProps> = ({ 
  showLogoutModal, 
  confirmLogout,
  handleLogoutClose,
  handleLogoutConfirm,
  }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  return (
    <div className="container-fluid bg-dark">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/list">Hotel Management</Link>
        <button className="navbar-toggler" type="button" onClick={handleShowOffcanvas} aria-controls="offcanvasNavbar">
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

      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/search" onClick={handleCloseOffcanvas}>Buscar Hotéis</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle text-white" to="#" id="navbarDropdownOffcanvas" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Admin
              </Link>
              <ul className="dropdown-menu bg-dark text-white" aria-labelledby="navbarDropdownOffcanvas">
                <li><Link className="dropdown-item text-white" to="/new/:new" onClick={handleCloseOffcanvas}>Adicionar Hotel</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item text-white" to="/list" onClick={handleCloseOffcanvas}>Listar Hotéis</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="#" onClick={() => { handleCloseOffcanvas(); confirmLogout(); }}>
                Logout <FiLogOut size={16} title='Logout' />
              </Link>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      <div>
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
};

export default NavbarTemplate;
