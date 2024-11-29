export interface NavbarProps {  
  showLogoutModal: boolean;  
  confirmLogout: () => void;
  handleLogoutClose: () => void;
  handleLogoutConfirm: () => void;  
}