import React from 'react';
import { useLocation } from 'react-router-dom'; 
import Navbar from './components/general/Navbar';
import AppRoutes from './routes';
import HeaderPage from './components/general/HeaderPage';
import FooterPage from './FooterPage';
import LocalStorageService from './services/general/localStorageService';
import CookieConsent from './components/general/CookieConsent';
import SecurityService from './services/general/securityService';
import Chatbot from './components/iaassistent/Chatbot';
import { nameStorageTokenJWT } from './auth-config';

const SinglePage: React.FC = () => {
    const location = useLocation();
    const showNavbar = isLoggedIn() && location.pathname !== '/';
    const showTitle = location.pathname !== '/';
    return (
        <div className="container-fluid p-0">
            {showTitle && <HeaderPage />}
            {showNavbar && <Navbar />}
            <main>
                <AppRoutes />
            </main>
            {/* Renderizar o CookieConsent apenas nas rotas / e /login */}
            {window.location.pathname === '/' || window.location.pathname === '/login' ? <CookieConsent /> : null}
            <Chatbot />
            <FooterPage />
        </div>
    );
};

const isLoggedIn = (): boolean => {
    return LocalStorageService.hasItem(nameStorageTokenJWT) && SecurityService.isTokenValid(nameStorageTokenJWT, null);
};

export default SinglePage;