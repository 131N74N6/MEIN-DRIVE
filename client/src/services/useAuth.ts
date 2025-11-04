import { useEffect, useReducer } from "react"
import type { AuthActionProps, AuthStateProps, GetCurrentUserProps, SignUpProps, UserTokenProps } from "./custom-types";
import { useNavigate } from "react-router-dom";

const initialState: AuthStateProps = {
    user: null,
    loading: false,
    error: null,
    userId: '',
    username: '',
    email: '',
    createdAt: ''
}

const authReducer = (state: AuthStateProps, action: AuthActionProps) => {
    switch (action.type) {
        case "SET_LOADING": return { ...state, loading: action.payload }
        case "SET_ERROR": return { ...state, error: action.payload, loading: false }
        case "SET_USER": return { ...state, user: action.payload, error: null };
        case "SET_USER_DATA": return { ...state, ...action.payload, error: null };
        case "RESET_STATE": return initialState;
        default: return state;
    }
}

export default function useAuth() {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const currentUserId = state.user ? state.user.signin_user_id : '';
    const navigate = useNavigate();
    const token = state.user ? state.user.token : '';

    useEffect(() => {
        async function initApp() {            
            const existedUser = localStorage.getItem('user');
            if (existedUser) dispatch({ type: 'SET_USER', payload: JSON.parse(existedUser) });
            dispatch({ type: 'SET_LOADING', payload: false });
            await getCurrentUserData();
        }

        initApp();
    }, []);

    const signIn = async (email: string, password: string): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const request = await fetch(`http://localhost:1234/users/sign-in`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                method: 'POST'
            });

            if (!request.ok) {
                const errorRequest = await request.json();
                throw new Error(errorRequest.message);
            }

            const response: UserTokenProps = await request.json();
            const currentUserToken = {
                status: response.status,
                signin_user_id: response.signin_user_id,
                token: response.token
            }

            dispatch({ type: 'SET_USER', payload: currentUserToken });
            localStorage.setItem('user', JSON.stringify(currentUserToken));
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'failed to sign-in' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    const signUp = async (props: SignUpProps): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const request = await fetch(`http://localhost:1234/users/sign-up`, {
                body: JSON.stringify(props),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });

            if (!request.ok) {
                const errorRequest = await request.json();
                throw new Error(errorRequest.message);
            }

            if (request.ok) navigate('/sign-in');
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'failed to sign-up' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    const signOut = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            localStorage.removeItem('user');
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'SET_USER_DATA', payload: {
                createdAt: '',
                email: '',
                userId: '',
                username: ''
            }});
            navigate('/sign-in');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'failed to sign-out' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    const getCurrentUserData = async () => {
        try {
            const request = await fetch(`http://localhost:1234/user-data/${currentUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });

            const response: GetCurrentUserProps = await request.json();

            dispatch({ type: 'SET_USER_DATA', payload: {
                createdAt: new Date(response.created_at).toLocaleString(),
                email: response.email,
                userId: response.user_id,
                username: response.username
            }});
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'failed to get user data' });
        }
    }

    return { 
        currentUserId, 
        loading: state.loading, 
        username: state.username,
        error: state.error, 
        email: state.email, 
        signIn, 
        created_at: state.createdAt,
        signOut, 
        signUp, 
        token
    }
}