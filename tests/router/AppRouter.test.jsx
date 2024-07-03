import { render, screen, fireEvent } from '@testing-library/react';
import { AppRouter } from '../../src/router/AppRouter';
import { useAuthStore } from '../../src/hooks';
import { MemoryRouter } from 'react-router-dom';
import { CalendarPage } from '../../src/calendar';

jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('Pruebas en <AppRouter />', () => { 

    const mockCheckAuthToken = jest.fn();

    beforeEach( () => jest.clearAllMocks() );    

    test('Debe de mostrar la pantalla de carga y llamar checkAuthToken', () => { 

        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });

        render(<AppRouter />);

        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();

        //screen.debug();
    });

    test('Debe de mostrar el login en caso de no estar autenticado', () => { 

        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render(
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();

        //screen.debug();
    });

    test('Debe de mostrar el calendario si estamos autenticados', () => { 

        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        expect(screen.getByText('CalendarPage')).toBeTruthy();

        screen.debug();
    });


});
