import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import HeaderPage from './components/HeaderPage';
import FooterPage from './FooterPage';
import LocalStorageService from './services/localStorageService';
import CookieConsent from './components/CookieConsent';
import SecurityService from './services/securityService';

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
            <FooterPage />
        </div>
    );
};

const isLoggedIn = (): boolean => {
    return LocalStorageService.hasItem('token') && SecurityService.isTokenValid(SecurityService.getToken());
};

export default SinglePage;