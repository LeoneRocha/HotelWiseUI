/*import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import LocalStorageService from '../services/localStorageService';


// Mocking LocalStorageService
jest.mock('../services/localStorageService');

describe('App Component', () => {
  it('deve renderizar o componente App', () => {
    // Mocking hasItem to return true
    (LocalStorageService.hasItem as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );

    // Asserções baseadas nos textos renderizados
    expect(getByText('HeaderPage')).toBeInTheDocument();
    expect(getByText('Navbar')).toBeInTheDocument();
    expect(getByText('FooterPage')).toBeInTheDocument();
  });

  it('deve renderizar sem Navbar e HeaderPage se não estiver logado', () => {
    // Mocking hasItem to return false
    (LocalStorageService.hasItem as jest.Mock).mockReturnValue(false);

    const { queryByText } = render(
      <Router>
        <App />
      </Router>
    );

    // Asserções para verificar a ausência de Navbar e HeaderPage
    expect(queryByText('HeaderPage')).not.toBeInTheDocument();
    expect(queryByText('Navbar')).not.toBeInTheDocument();
    expect(queryByText('FooterPage')).toBeInTheDocument();
  });
});
 */