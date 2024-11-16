import React from 'react'; 
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';  
const HeaderPage: React.FC = () => {
    return (
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
    );
};
export default HeaderPage;