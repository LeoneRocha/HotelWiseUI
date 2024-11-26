import React from 'react'; 

export interface NavbarProps {
  query: string;
  response: string;
  showModal: boolean;
  showLogoutModal: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  confirmLogout: () => void;
  handleLogoutClose: () => void;
  handleLogoutConfirm: () => void;
  setShowModal: (show: boolean) => void;
}