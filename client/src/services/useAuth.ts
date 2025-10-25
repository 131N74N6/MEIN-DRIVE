import { useEffect, useState } from "react"
import type { GetCurrentUserProps, SignUpProps, UserTokenProps } from "./custom-types";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
    const [user, setUser] = useState<UserTokenProps | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            const request = await fetch(`http://localhost:1234/users/sign-in`, {
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

    const getCurrentUserData = async (): Promise<GetCurrentUserProps | undefined> => {
        try {
            const request = await fetch(`http://localhost:1234/user-data/${user?.signin_user_id}`);
            const response: GetCurrentUserProps = await request.json();
            return response;
        } catch (error) {
            setError('failed to get user data');
        }
    }

    return { 
        getCurrentUserData, 
        loading, 
        error, 
        signIn, 
        signOut, 
        signUp, 
        user 
    }
}