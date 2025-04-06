import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './css/App.css' 
import SinglePage from './SinglePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App: React.FC = () => {
  return (
    <Router>
      <SinglePage />
    </Router>
  );
};
export default App;