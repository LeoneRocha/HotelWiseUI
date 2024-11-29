import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import LocalStorageService from '../services/localStorageService'; 
import NavbarTemplate from './NavbarTemplate';

const Navbar: React.FC = () => { 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
 
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
      showLogoutModal={showLogoutModal} 
      confirmLogout={confirmLogout}
      handleLogoutClose={handleLogoutClose}
      handleLogoutConfirm={handleLogoutConfirm} 
    />
  );
};

export default Navbar;