import { jwtDecode, JwtPayload } from 'jwt-decode';
import LocalStorageService from './localStorageService';  
import DataUtilsHelper from '../helpers/dataUtilshelper';

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
                if (decoded.exp) {
                    console.log('Token expiration time:', DataUtilsHelper.formatTimestamp(decoded.exp));
                }
                return decoded.exp ? decoded.exp > currentTime : false;
            }
            console.log('Token is null');
            return false;

        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }

    static isTokenExpired(token: string): boolean {
        return !this.isTokenValid(token);
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
