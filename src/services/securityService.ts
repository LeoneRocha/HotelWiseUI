import { jwtDecode, JwtPayload } from 'jwt-decode';
import LocalStorageService from './localStorageService';
import EnvironmentService from './EnvironmentService';

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
                    console.log('Token expiration time:', this.formatTimestamp(decoded.exp));
                }
                return decoded.exp ? decoded.exp > currentTime : false;
            }
            if (EnvironmentService.isNotTestEnvironment()) {
                console.log('Token is null');
            }
            return false;

        } catch (error) {
            if (EnvironmentService.isNotTestEnvironment()) {
                console.error('Error decoding token:', error);
            }
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
    static formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000); // Convertendo de segundos para milissegundos
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
}

export default SecurityService;
