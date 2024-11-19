import { jwtDecode, JwtPayload } from 'jwt-decode';
import LocalStorageService from './localStorageService';

class SecurityService {
    static isTokenValid(token: string | null): boolean {
        if (token === null) {
            token = SecurityService.getToken();
        }
        try {
            if (token !== null) {
                const decoded = jwtDecode<JwtPayload>(token);
                console.log('Decoded token:', decoded); 
                const currentTime = Date.now() / 1000; 
                return decoded.exp ? decoded.exp > currentTime : false;
            }
            console.log('Token is null');
            return false;

        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }

    static getToken(): string | null {
        return LocalStorageService.getItem('token');
    }

    static setToken(token: string): void {
        LocalStorageService.setItem('token', token);
    }

    static removeToken(): void {
        LocalStorageService.removeItem('token');
    }
}

export default SecurityService;
