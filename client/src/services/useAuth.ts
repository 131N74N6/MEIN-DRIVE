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
    const navigate = useNavigate();
    const token = state.user ? state.user.token : '';

    useEffect(() => {
        const existedUser = localStorage.getItem('user');
        if (existedUser) setUser(JSON.parse(existedUser));
        setLoading(false);
    }, []);

    const signIn = async (email: string, password: string): Promise<void> => {
        setLoading(true);
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

            setUser(currentUserToken);
            localStorage.setItem('user', JSON.stringify(currentUserToken));
        } catch (error: any) {
            setError(error.message || 'failed to sign-in');
        } finally {
            setLoading(false);
        }
    }

    const signUp = async (props: SignUpProps): Promise<void> => {
        setLoading(true);
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
            setError(error.message || 'failed to sign-up');
        } finally {
            setLoading(false);
        }
    }

    const signOut = async () => {
        setLoading(true);
        try {
            localStorage.removeItem('user');
            setUser(null);
            navigate('/sign-in');
        } catch (error) {
            setError('failed to sign-out');
        } finally {
            setLoading(false);
        }
    }

    const getCurrentUserData = async () => {
        try {
            const request = await fetch(`http://localhost:1234/user-data/${user?.signin_user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });

            const response: GetCurrentUserProps = await request.json();

            setUsername(response.username);
            setEmail(response.email);
            setUserId(response.user_id);
            setCreatedAt(new Date(response.created_at).toLocaleString());
        } catch (error) {
            setError('failed to get user data');
        }
    }

    return { 
        getCurrentUserData, userId, loading, username,
        error, email, signIn, createdAt,
        signOut, signUp, user 
    }
}