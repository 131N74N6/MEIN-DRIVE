import { useEffect, useReducer, useCallback } from "react"
import type { AuthActionProps, AuthStateProps, GetCurrentUserProps, SignUpProps, UserTokenProps } from "./custom-types";
import { useNavigate } from "react-router-dom";

const initialState: AuthStateProps = {
    user: null,
    loading: true, // Set initial loading to true
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
        case "SET_USER": 
            return { 
                ...state, 
                user: action.payload, 
                userId: action.payload?.user_id || '', // Ensure userId is set
                error: null 
            };
        case "SET_USER_DATA": 
            return { 
                ...state, 
                ...action.payload, 
                error: null 
            };
        case "RESET_STATE": return initialState;
        default: return state;
    }
}

export default function useAuth() {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    // Use useCallback to prevent unnecessary recreations
    const getCurrentUserData = useCallback(async (userId: string, token: string) => {
        if (!userId || !token) return;
        
        try {
            const request = await fetch(`http://localhost:1234/users/user-data/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });

            if (!request.ok) {
                throw new Error('Failed to get user data');
            }

            const response: GetCurrentUserProps = await request.json();

            dispatch({ 
                type: 'SET_USER_DATA', 
                payload: {
                    createdAt: new Date(response.created_at).toLocaleString(),
                    email: response.email,
                    userId: response.user_id,
                    username: response.username
                }
            });
        } catch (error) {
            console.error('Failed to get user data:', error);
            // Don't set error here to avoid blocking navigation
        }
    }, []);

    useEffect(() => {
        const initApp = async () => {            
            try {
                const existedUser = localStorage.getItem('user');
                if (existedUser) {
                    const userData = JSON.parse(existedUser);
                    dispatch({ type: 'SET_USER', payload: userData });
                    // Get user data in background, don't wait for it
                    getCurrentUserData(userData.user_id, userData.token);
                }
            } catch (error) {
                console.error('Init app error:', error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initApp();
    }, [getCurrentUserData]);

    const signIn = async (email: string, password: string): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
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
                user_id: response.user_id,
                token: response.token
            }

            // Set user immediately for navigation
            dispatch({ type: 'SET_USER', payload: currentUserToken });
            localStorage.setItem('user', JSON.stringify(currentUserToken));
            
            // Get additional user data in background
            getCurrentUserData(response.user_id, response.token);
            
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign in' });
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    const signUp = async (props: SignUpProps): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
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

            navigate('/sign-in');
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign up' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    const signOut = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            localStorage.removeItem('user');
            dispatch({ type: 'RESET_STATE' });
            navigate('/sign-in');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to sign out' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    return { 
        currentUserId: state.userId, 
        loading: state.loading, 
        username: state.username,
        error: state.error, 
        email: state.email, 
        signIn, 
        created_at: state.createdAt,
        signOut, 
        signUp, 
        token: state.user?.token || ''
    }
}