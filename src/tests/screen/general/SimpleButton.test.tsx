import { render, screen, fireEvent } from '@testing-library/react';  
import { SimpleButton } from '../../../components/general/SimpleButton';

describe('SimpleButton', () => {
    it('renders the button with the given label', () => {
        render(<SimpleButton label="Click Me" onClick={() => {}} />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('calls the onClick handler when clicked', () => {
        const mockOnClick = jest.fn();
        render(<SimpleButton label="Click Me" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('Click Me'));
        expect(mockOnClick).toHaveBeenCalled();
    });
});
