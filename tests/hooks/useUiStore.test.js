import {renderHook, act } from '@testing-library/react';
import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "../../src/store";
import { useUiStore } from '../../src/hooks/useUiStore';
import { Provider } from 'react-redux';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    });
}

describe('Pruebas en useUiStore', () => { 
    
    test('Debe de regresar los valores por defecto', () => { 

        const modalOpenDefaultValue = true;

        const mockStore = getMockStore({ isDateModalOpen: modalOpenDefaultValue });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>

        });

        expect(result.current).toEqual({
            isDateModalOpen: modalOpenDefaultValue,
            openDateModal: expect.any(Function) ,
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),    
        });
     });

     test('openDateModal debe de colocar true el valor de isDateModalOpen', () => { 

        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>

        });

        const { openDateModal } = result.current;

        act( () => {
            openDateModal();
        } );        

        expect(result.current.isDateModalOpen).toBeTruthy();

     });

     test('closeDateModal debe de colocar false el valor de isDateModalOpen', () => { 

        const mockStore = getMockStore({ isDateModalOpen: true });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>

        });

        const { closeDateModal } = result.current;

        act( () => {
            closeDateModal();
        } );        

        expect(result.current.isDateModalOpen).toBeFalsy();

     });

     test('toggleDateModal debe de cambiar isDateModalOpen a su valor negado', () => { 

        const isOpenVal = true;

        const mockStore = getMockStore({ isDateModalOpen: isOpenVal });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ( {children} ) => <Provider store={ mockStore }>{children}</Provider>

        });

        act( () => {
            result.current.toggleDateModal();
        } );        

        expect(result.current.isDateModalOpen).toBe(!isOpenVal);

        act( () => {
            result.current.toggleDateModal();
        } );        

        expect(result.current.isDateModalOpen).toBe(!!isOpenVal);

     });

     


});