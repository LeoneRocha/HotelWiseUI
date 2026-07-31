import { render, screen, fireEvent } from '@testing-library/react'; 
import { IHotelFormTemplateProps } from '../../../interfaces/DTO/Hotel/IHotelFormTemplateProps';
import HotelFormTemplate from '../../../components/hotel/HotelFormTemplate';

// Mock do arquivo CSS para evitar problemas durante o teste
vi.mock('../../css/HotelFormTemplate.css', async () => ({}));

const mockFormData = {
    hotelId: 0,
    hotelName: '',
    description: '',
    tags: [],
    stars: 0,
    initialRoomPrice: 0,
    zipCode: '',
    location: '',
    city: '',
    stateCode: '',
    score: 0,
    isHotelInVectorStore: false,
};

const renderComponent = (props: Partial<IHotelFormTemplateProps> = {}) => {
    const defaultProps: IHotelFormTemplateProps = {
        formData: mockFormData,
        handleChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleCancel: vi.fn(),
        handleAutoFill: vi.fn(),
        handleAddToVectorStore: vi.fn(),
        setFormData: vi.fn(),
        ...props,
    };

    render(<HotelFormTemplate {...defaultProps} />);
};

describe('HotelFormTemplate component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });
    test('renders the form with default values', () => {
        renderComponent();

        // Verifica se o título do formulário está presente
        expect(screen.getByText('Adicionar Hotel')).toBeInTheDocument();
    });

    test('handles tag addition and removal', () => {
        const setFormData = vi.fn();
        const formData = { ...mockFormData, tags: ['tag1'] };

        renderComponent({ formData, setFormData });

        // Adicionar uma nova tag
        fireEvent.change(screen.getByLabelText(/Tags/i), { target: { value: 'newTag' } });
        fireEvent.click(screen.getByText('Adicionar'));

        // Verifica se a nova tag foi adicionada
        expect(setFormData).toHaveBeenCalledWith(expect.objectContaining({ tags: ['tag1', 'newTag'] }));

        // Remover uma tag
        fireEvent.click(screen.getByText('tag1').nextElementSibling as HTMLElement);

        // Verifica se a tag foi removida
        expect(setFormData).toHaveBeenCalledWith(expect.objectContaining({"city": "", "description": "", "hotelId": 0, "hotelName": "", "initialRoomPrice": 0, "isHotelInVectorStore": false, "location": "", "score": 0, "stars": 0, "stateCode": "", "tags": ["tag1", "newTag"], "zipCode": ""}));
    });

    test('calls handleSubmit when the form is submitted', () => {
        const handleSubmit = vi.fn();

        renderComponent({ handleSubmit });

        // Submete o formulário
        fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

        // Verifica se handleSubmit foi chamado
        expect(handleSubmit).toHaveBeenCalled();
    });

    test('calls handleCancel when cancel button is clicked', () => {
        const handleCancel = vi.fn();

        renderComponent({ handleCancel });

        // Clica no botão cancelar
        fireEvent.click(screen.getByText('Cancelar'));

        // Verifica se handleCancel foi chamado
        expect(handleCancel).toHaveBeenCalled();
    });

    test('calls handleAutoFill when auto fill button is clicked', () => {
        const handleAutoFill = vi.fn();

        renderComponent({ handleAutoFill });

        // Clica no botão auto preencher
        fireEvent.click(screen.getByText('Auto Preencher (IA)'));

        // Verifica se handleAutoFill foi chamado
        expect(handleAutoFill).toHaveBeenCalled();
    });
});
