import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import AuthServices from "./auth_service";
import DataModifier from "./data_service";
import { useEffect, useState } from "react";
import type { CurrentUserIntrf } from "../models/user_model";

export default function UserServices(user_id?: string) {
    const { changeData, deleteData, message, setMessage } = DataModifier();
    const { signOut, userData, userError, userLoading } = AuthServices();
    const queryClient = useQueryClient();

    const [newProfile, setNewProfile] = useState({ email: '', username: '' });
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setNewProfile({ ...newProfile, [name]: value });
    }

    useEffect(() => {
        if (user_id && userData) setNewProfile({ email: userData.email, username: userData.username });
        else return;
    }, [user_id, userData, editMode]);

    const deleteAccountMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/users/delete-myself/${user_id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or check your internet connection');
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: [`all-files-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-folders-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${user_id}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-`) ||
                        queryKey[0].startsWith(`is-file-favorited-`) || 
                        queryKey[0].startsWith("is-folder-favorited-")
                    }
                    return false;
                }
            });
            await signOut();
        },
        onSettled: () => setIsProcessing(false)
    });

    const changeProfileMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await changeData<CurrentUserIntrf>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/users/change/${user_id}`,
                data: {
                    email: newProfile.email.trim(),
                    username: newProfile.username.trim()
                } 
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to change or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            setNewProfile({ email: '', username: '' });
            setEditMode(false);
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
        },
        onSettled: () => setIsProcessing(false)
    });

    return { 
        changeProfileMt, deleteAccountMt, editMode, handleInputChange, isProcessing, message,
        newProfile, setEditMode, setIsProcessing, setMessage, setNewProfile, userData, userError, userLoading 
    }
}