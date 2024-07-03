import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store/auth/authSlice';
import { onLogoutCalendar } from '../store/calendar/calendarSlice';

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async ({ email, password}) =>{
        dispatch( onChecking() );
        //console.log({ email, password });
        try{
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name:data.name, uid: data.uid }) );
            //console.log(data);
        } catch ( error ){
            dispatch( onLogout('Credenciales incorrectas') );
            //console.log(error);
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    };

    const startRegister = async ({ name, email, password}) =>{
        dispatch( onChecking() );
        //console.log({ email, password });
        try{
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name:data.name, uid: data.uid }) );
            //console.log(data);
        } catch ( error ){
            const msg  = error.response.data?.msg || '---';
            const errs = error.response.data?.errors;

            if (errs){
                dispatch( onLogout(JSON.stringify(errs)));
            } else {
                dispatch( onLogout('Datos de registro incorrecto: ' + msg) );
            }
            //console.log(error);
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 1000);
        }
    };

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name:data.name, uid: data.uid }) );
        } catch (error) {
            console.log(error);
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
        dispatch( onLogoutCalendar() );
    }

    return {
        //* Propiedades 
        status,
        user,
        errorMessage,

        //* Metodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }
}