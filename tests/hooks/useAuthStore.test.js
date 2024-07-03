import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import {renderHook, act, waitFor } from '@testing-library/react';

import { authSlice } from "../../src/store";
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUsers';
import { calendarApi } from '../../src/api';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
}

describe('Pruebas en useAuthStore', () => { 

    const defaultState = initialState;

    beforeEach(() => {
        localStorage.clear();
    });

    test('Debe de regresar los valores por defecto', () => { 
        const mockStore = getMockStore({...defaultState});

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        expect(result.current).toEqual({
            status: defaultState.status,
            user: defaultState.user,
            errorMessage: defaultState.errorMessage,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        });

    });

    test('startLogin debe de realizar el login correctamente', async () => { 
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        await act( async () => {
            await result.current.startLogin( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: testUserCredentials.name, uid: testUserCredentials.uid },
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('startLogin debe de fallar por credenciales incorrectas', async () => { 
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        await act( async () => {
            await result.current.startLogin( {email: 'pepe@google.com', password: 'wrongpass'} );
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {},
        });

        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('token-init-date')).toBe(null);

        await waitFor( 
            () => expect(result.current.errorMessage).toBe(undefined)
        );
    });

    test('startRegister debe de crear un usuario', async () => { 
        const newUser = { email: 'algo@google.com', password: 'algunpass', name: 'Test User 2'};
        const newUserId = 'somenewuserid';

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: newUserId,
                name: newUser.name,
                token: 'sometoken'
            }
        });

        await act( async () => {
            await result.current.startRegister( newUser );
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: newUser.name, uid: newUserId},
        });

        spy.mockRestore();

    });

    test('startRegister debe de fallar la creacion por usuario ya existente', async () => { 

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        await act( async () => {
            await result.current.startRegister( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {},
        });

    });

    test('checkAuthToken debe de fallar si no hay token', async () => { 

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {},
        });

    });

    test('checkAuthToken debe autenticar el usuario si hay un token vigente', async () => { 

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: testUserCredentials.name,
                uid: testUserCredentials.uid,
            },
        });

    });
    
 });