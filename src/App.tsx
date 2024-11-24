import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import SinglePage from './SinglePage';

const App: React.FC = () => {
  return (
    <Router>
      <SinglePage />
    </Router>
  );
};
export default App;