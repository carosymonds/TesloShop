import { FC, useReducer, useEffect } from 'react';
import { AuthContext } from './';
import Cookies from 'js-cookie';
import axios from 'axios';

import { IUser } from '../../interfaces/user';
import tesloApi from '../../api/tesloApi';
import { authReducer } from './authReducer';
import { Router } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

interface Props {
    children: React.ReactNode;
}


export const AuthProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );




    // useEffect(() => {
    //     checkToken();
    // }, [])

    const checkToken = async() => {

        try {
            if(!Cookies.get('token')){
                return;
            }

            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }
    
    const router = useRouter();
    const session = useSession();
  

    useEffect(() => {
        console.log(session)
        if ( session.status === 'authenticated' ) {
          console.log({user: session.data?.user});
          dispatch({ type: '[Auth] - Login', payload: session.data?.user as IUser })
        }
      
      }, [ session ])

    const loginUser = async( email: string, password: string ): Promise<boolean> => {

        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user});
            return true;
        } catch (error) {
            return false;
        }

    }

    const logoutUser = async(): Promise<boolean> => {

        try {
            signOut();
            // router.reload()
            // dispatch({ type: '[Auth] - Logout'});
            return true;
        } catch (error) {
            return false;
        }

    }


    const registerUser = async( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: "error.response"
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }



    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logoutUser

        }}>
            { children }
        </AuthContext.Provider>
    )
};