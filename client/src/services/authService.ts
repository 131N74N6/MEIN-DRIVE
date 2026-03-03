import { useEffect, useState } from "react"
import type { SignUpProps, CurrentUserTokenIntrf } from "../models/userModel";

export default function useAuth() {
    const [currentToken, setCurrentToken] = useState<CurrentUserTokenIntrf | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [userError, setUserError] = useState<string | null>(null);

    const currentUserId = currentToken ? currentToken.user_id : '';
    const token = currentToken ? currentToken.token : '';

    useEffect(() => {
        function initApp() {
            try {
                const existedUser = localStorage.getItem('user');
                if (existedUser) {
                    const userData: CurrentUserTokenIntrf = JSON.parse(existedUser);
                    setCurrentToken(userData);
                }
            } catch (error: any) {
                setCurrentToken(null);
                setUserError(error.message);
                localStorage.removeItem('user');
            } finally {
                setUserLoading(false);
            }
        }

        initApp();
    }, []);

    async function signIn(email: string, password: string, callback: (path: string) => void): Promise<void> {
        setUserLoading(true);
        setUserError(null);

        try {
            const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sign-in`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign in. Try again later';
                setUserError(errorMessage);
            } else {
                const currentUserToken: CurrentUserTokenIntrf = {
                    status: response.status,
                    token: response.token,
                    user_id: response.user_id
                };

                localStorage.setItem('user', JSON.stringify(currentUserToken));
                setCurrentToken(currentUserToken);
                callback(`/home/${currentUserToken.user_id}`);
            }
        } catch (error: any) {
            setUserError(error.message || 'Failed to sign in');
        } finally {
            setUserLoading(false);
        }
    }

    async function signUp (props: SignUpProps): Promise<void> {
        setUserLoading(true);
        setUserError(null);
        
        try {
            const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sign-up`, {
                body: JSON.stringify(props),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign up. Try again later';
                setUserError(errorMessage);
            } else {
                props.callback('/sign-in');
            }

        } catch (error: any) {
            setUserError(error.message || 'Failed to sign up' );
        } finally {
            setUserLoading(false);
        }
    }

    function signOut(callback: (path: string) => void) {
        setUserLoading(true);
        setUserError(null);

        try {
            localStorage.removeItem('user');
            setCurrentToken(null);
            callback('/sign-in');
        } catch (error: any) {
            setUserError(error.message || 'Failed to sign out' );
        } finally {
            setUserLoading(false);
        }
    }

    return { 
        currentUserId,
        signIn, 
        signOut, 
        signUp, 
        setUserError, 
        setUserLoading, 
        token,
        userError, 
        userLoading 
    }
}