import { useState } from "react"
import type { SignUpProps, CurrentUserIntrf } from "../models/userModel";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function AuthServices() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [authError, setAuthError] = useState<string | null>(null);

    const { data: userData, isLoading: userLoading, error: userError } = useQuery<CurrentUserIntrf | null>({
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/user-data`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                });

                if (!request.ok) return null;
                else return await request.json();
            } catch (error) {
                return null;
            }
        },
        queryKey: ['current-user'],
        retry: false,
        staleTime: Infinity
    });
    
    const currentUserId = userData && userData.user_id;
    const currentUserName = userData && userData.username;

    async function signIn(email: string, password: string) {
        try {
            const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sign-in`, {
                body: JSON.stringify({ email, password }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign in. Try again later';
                throw new Error(errorMessage);
            } else {
                await queryClient.invalidateQueries({ queryKey: ['current-user'] });
                navigate(`/home/${currentUserId!}`);
            }
        } catch (error: any) {
            setAuthError(error.message || 'Failed to sign in');
        } 
    }

    async function signUp (props: SignUpProps): Promise<void> {
        try {
            const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sign-up`, {
                body: JSON.stringify(props),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign up. Try again later';
                throw new Error(errorMessage);
            } else {
                navigate('/sign-in');
            }
        } catch (error: any) {
            setAuthError(error.message || 'Failed to sign up' );
        }
    }

    async function signOut() {
        setAuthError(null);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sign-out`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });
        } catch (error: any) {
            //
        } finally {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            navigate('/sign-in');
        }
    }

    return { 
        authError,
        currentUserId,
        currentUserName, 
        signIn, 
        signOut, 
        signUp, 
        setAuthError, 
        userData,
        userError, 
        userLoading 
    }
}