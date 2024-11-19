import { jwtDecode, JwtPayload } from 'jwt-decode';
import LocalStorageService from './localStorageService';

class SecurityService {
    static isTokenValid(token: string): boolean {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp ? decoded.exp > currentTime : false;
        } catch (error) {
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
