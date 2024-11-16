import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router> 
      <div className="container-fluid p-0">
        <header className="bg-primary text-white text-center py-3">
          <h1>Gerenciamento de Hotéis</h1>
          <h2>Vite + React</h2>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </header>
        <Navbar />
        <main className="container-fluid">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
};
export default App;