import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AppRoutes from '../../routes';
import HeaderPage from './HeaderPage';
import LocalStorageService from '../../services/general/localStorageService';
import CookieConsent from './CookieConsent';
import SecurityService from '../../services/general/securityService';
import Chatbot from '../iaassistent/Chatbot';
import { nameStorageTokenJWT } from '../../auth-config';
import FooterPage from './FooterPage';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

const isLoggedIn = (): boolean => {
    return LocalStorageService.hasItem(nameStorageTokenJWT) && SecurityService.isTokenValid(nameStorageTokenJWT, null);
};

export default SinglePage;
