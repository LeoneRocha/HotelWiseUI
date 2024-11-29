export interface INavbarProps {  
  showLogoutModal: boolean;  
  confirmLogout: () => void;
  handleLogoutClose: () => void;
  handleLogoutConfirm: () => void;  
}