import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import HeaderPage from './components/HeaderPage';
import FooterPage from './FooterPage';
import LocalStorageService from './services/localStorageService';

const App: React.FC = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main: React.FC = () => {
  const location = useLocation();
  const showNavbar = isLoggedIn() && location.pathname !== '/';

  return (
    <div className="container-fluid p-0">
      {showNavbar && <HeaderPage />}
      {showNavbar && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      <FooterPage />
    </div>
  );
};

const isLoggedIn = (): boolean => {
  return LocalStorageService.hasItem('token');
};

export default App;
