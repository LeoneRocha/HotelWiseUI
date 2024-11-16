import React from 'react';
import { BrowserRouter as Router, useLocation, } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import HeaderPage from './HeaderPage';
import FooterPage from './FooterPage';

const App: React.FC = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="container-fluid p-0">
      {showNavbar && <HeaderPage />}
      {showNavbar && <Navbar />}
      <main className="container-fluid">
        <AppRoutes />
      </main>
      <FooterPage/>
    </div>
  );
};
export default App;