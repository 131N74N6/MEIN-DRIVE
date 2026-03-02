import { useEffect, useState } from "react"
import type { SignUpProps } from "../models/userModel";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(false);
    const [userError, setUserError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function initApp() {            
            try {
                const existedUser = localStorage.getItem('user');
                if (existedUser) {
                    const userData = JSON.parse(existedUser);
                    setCurrentUserId(userData);
                }
            } catch (error: any) {
                setCurrentUserId(null);
                setUserError(error.message);
                localStorage.removeItem('user');
            } finally {
                setUserLoading(false);
            }
        };

        initApp();
    }, []);

    async function signIn(email: string, password: string): Promise<void> {
        setUserLoading(true);
        setUserError(null);
        
        try {
            const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/sign-in`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign in. Try again later';
                setUserError(errorMessage);
            } else {
                const currentUserToken = {
                    status: response.status,
                    user_id: response.user_id,
                    token: response.token
                }
                
                localStorage.setItem('user', JSON.stringify(currentUserToken));
                setCurrentUserId(currentUserToken.user_id);
            }
        } catch (error: any) {
            setUserError(error.message || 'Failed to sign in' );
        } finally {
            setUserLoading(false);
        }
    }

    async function signUp (props: SignUpProps): Promise<void> {
        setUserLoading(true);
        setUserError(null);
        
        try {
            const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/sign-up`, {
                body: JSON.stringify(props),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign up. Try again later';
                setUserError(errorMessage);
            } else {
                navigate('/sign-in');
            }

        } catch (error: any) {
            setUserError(error.message || 'Failed to sign up' );
        } finally {
            setUserLoading(false);
        }
    }

    async function signOut() {
        setUserLoading(true);
        setUserError(null);

        try {
            localStorage.removeItem('user');
            setCurrentUserId(null);
            navigate('/sign-in');
        } catch (error: any) {
            setUserError(error.message || 'Failed to sign out' );
        } finally {
            setUserLoading(false);
        }
    }

    return { 
        currentUserId: currentUserId ? currentUserId : '', signIn, signOut, signUp, setUserError, setUserLoading, userError, userLoading 
    }
}