import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en Calendar Slice', () => { 

    test('Debe de regresar el estado por defecto', () => { 

        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);

     });

     test('onSetActiveEvent debe de activar el evento', () => { 

        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect(state.activeEvent).toEqual(events[0]);

     });

     test('onAddNewEvent debe de agregar el evento', () => { 

        const newEvent = {
            id: '3',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'Cumple de Otro',
            notes: 'Otra nota',    
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect(state.events).toEqual([ ...events, newEvent ]);

     });

     test('onUpdateEvent debe de actualizar el evento', () => { 

        const updatedEvent = {
            id: '1',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'Cumple de Fernando actualizado',
            notes: 'Alguna nota actualizada',    
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect(state.events).toContain(updatedEvent);

     });

     test('onDeleteEvent debe de borrar el evento activo', () => { 

        const state1 = calendarWithActiveEventState;
        const activeEv1 = state1.activeEvent;

        const state2 = calendarSlice.reducer( state1, onDeleteEvent() );
        expect(state2.events).not.toContain(activeEv1);
        expect(state2.activeEvent).toBe(null);

     });

     test('onLoadEvents debe de establecer los eventos', () => { 

        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect(state.events).toEqual([...events]);
        expect(state.isLoadingEvents).toBeFalsy();

        const newState = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect(state.events.length).toBe(events.length);

     });

     test('onLogoutCalendar debe de limpiar el estado', () => { 
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect(state.events).toEqual([]);
        expect(state.isLoadingEvents).toBeTruthy();
        expect(state.activeEvent).toBe(null);

     });    

 });
