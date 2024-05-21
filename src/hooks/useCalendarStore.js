import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from '../store';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    };
    const startSavingEvent = async ( calendarEvent ) => {
        try {
            if (calendarEvent.id){
                // Actualizando
                const { data } = await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch( onUpdateEvent({ ...calendarEvent, user }));
            } else {
                // Creando
                const { data } = await calendarApi.post('/events', calendarEvent);
                //console.log({data});            
                dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
            }            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    };

    const startDeletingEvent = async ( calendarEvent ) => {
        try {
            // Borrar
            const { data } = await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch( onDeleteEvent() );
        } catch (error) {
            console.log(error);
            Swal.fire('Error al borrar', error.response.data.msg, 'error');
        }        
    };

    const startLoadingEvents = async () => {
        try {

            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.eventos );
            dispatch( onLoadEvents(events) );
            //console.log({events});
            
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    };


    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Metodos
        setActiveEvent,
        startDeletingEvent,
        startSavingEvent,
        startLoadingEvents,
    }
}