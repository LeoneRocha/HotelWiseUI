import { render, screen, fireEvent } from '@testing-library/react'; 
import { ILoginFormTemplateProps } from '../../interfaces/DTO/ILoginFormTemplateProps';
import LoginFormTemplate from '../../components/general/LoginFormTemplate';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../../css/Login.css', () => ({}));

const renderComponent = (props: Partial<ILoginFormTemplateProps> = {}) => {
  const defaultProps: ILoginFormTemplateProps = {
    username: '',
    password: '',
    rememberMe: false,
    error: null,
    onUsernameChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onRememberMeChange: jest.fn(),
    onSubmit: jest.fn(),
    onAzureLogin: jest.fn(),
    ...props,
  };

  render(<LoginFormTemplate {...defaultProps} />);
};

describe('LoginFormTemplate component', () => {
  test('renders login form', () => {
    renderComponent();

    // Verifica se os elementos do formulário de login são renderizados
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lembrar-me/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /entrar/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar com conta microsoft/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    const onUsernameChange = jest.fn();
    const onPasswordChange = jest.fn();
    renderComponent({ onUsernameChange, onPasswordChange });

    // Altera o valor do campo de usuário
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testUser' } });
    // Altera o valor do campo de senha
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testPassword' } });

    // Verifica se as funções de mudança foram chamadas
    expect(onUsernameChange).toHaveBeenCalled();
    expect(onPasswordChange).toHaveBeenCalled();
  });

  test('handles remember me change', () => {
    const onRememberMeChange = jest.fn();
    renderComponent({ onRememberMeChange });

    // Seleciona a opção "Lembrar-me"
    fireEvent.click(screen.getByLabelText(/lembrar-me/i));

    // Verifica se a função de mudança foi chamada
    expect(onRememberMeChange).toHaveBeenCalled();
  });

  test('submits the form', () => {
    const onSubmit = jest.fn();
    renderComponent({ onSubmit });

    // Submete o formulário de login
    fireEvent.submit(screen.getByRole('form'));

    // Verifica se a função onSubmit foi chamada
    expect(onSubmit).toHaveBeenCalled();
  });

  test('handles Azure login', () => {
    const onAzureLogin = jest.fn();
    renderComponent({ onAzureLogin });

    // Clica no botão de login com Azure
    fireEvent.click(screen.getByRole('button', { name: /entrar com conta microsoft/i }));

    // Verifica se a função onAzureLogin foi chamada
    expect(onAzureLogin).toHaveBeenCalled();
  });

  test('displays error message', () => {
    const error = 'Erro de autenticação';
    renderComponent({ error });

    // Verifica se a mensagem de erro é exibida
    expect(screen.getByText(error)).toBeInTheDocument();
  });
});
