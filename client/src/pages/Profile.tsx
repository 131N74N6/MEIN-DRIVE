import { useNavigate, useParams } from "react-router-dom";
import type { CurrentUserIntrf } from "../models/userModel";
import DataModifier from "../services/dataService"
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAuth from "../services/authService";

export default function Profile() {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const { changeData, deleteData, getData } = DataModifier();
    const { signOut } = useAuth();
    const queryClient = useQueryClient();

    const [newProfile, setNewProfile] = useState({ email: '', username: '' });
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { data: currentUserData, isLoading, error } = getData<CurrentUserIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/users/user-data/${user_id}`,
        query_key: [`current-user-${user_id}`],
        stale_time: 1200000,
    });

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setNewProfile({ ...newProfile, [name]: value });
    }

    useEffect(() => {
        if (user_id && currentUserData) setNewProfile({ email: currentUserData.email, username: currentUserData.username });
        else return;
    }, [user_id, currentUserData, editMode]);

    const deleteAccountMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/users/delete-myself/${user_id}` });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`current-user-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-files-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-folders-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${user_id}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-`);
                    }
                    return false;
                }
            });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`);
                    }
                    return false;
                }
            });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith("is-folder-favorited-");
                    }
                    return false;
                }
            });
            signOut(navigate);
        },
        onSettled: () => setIsProcessing(false)
    });

    const changeProfileMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await changeData<CurrentUserIntrf>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/users/change/${user_id}`,
                data: {
                    email: newProfile.email.trim(),
                    username: newProfile.username.trim()
                } 
            });
        },
        onSuccess: () => {
            setNewProfile({ email: '', username: '' });
            setEditMode(false);
            queryClient.invalidateQueries({ queryKey: [`current-user-${user_id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    function cancelEditProfile() {
        setEditMode(false);
        setNewProfile({ email: '', username: '' });
    }

    function applyEditedProfile(event: React.FormEvent) {
        event.preventDefault();
        changeProfileMt.mutate();
    }

    return (
        <div className="h-screen flex md:flex-row flex-col gap-4 p-4">
            {isLoading ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <Loading/>
                </div>
            ) : error ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <p className="text-blue-300 font-medium text-[1rem]">{error.message}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white p-4">
                    <span className="font-medium md:text-lg text-base">user id: {currentUserData?.user_id}</span>
                    {editMode ? (
                        <form className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <label className="font-medium md:text-md text-base" htmlFor="new_email">email: </label>
                                <input 
                                    type="text" 
                                    name="email"
                                    id="new_email"
                                    value={newProfile.email}
                                    className="border border-gray-600 text-black text-base md:text-md p-1.5 outline-0 w-full font-medium"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label className="font-medium md:text-md text-base" htmlFor="new_name">username: </label>
                                <input 
                                    type="text"
                                    name="username"
                                    id="new_name"
                                    value={newProfile.username}
                                    className="border border-gray-600 text-black text-base md:text-md p-1.5 outline-0 w-full font-medium"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    ) : (
                        <>
                            <span className="font-medium md:text-lg text-base">email: {currentUserData?.email}</span>
                            <span className="font-medium md:text-lg text-base">username: {currentUserData?.username}</span>
                        </>
                    )}
                    <span className="font-medium md:text-lg text-base">created at: {currentUserData ? new Date(currentUserData.created_at).toLocaleString() : '-'}</span>
                    {editMode ? (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                disabled={isProcessing} 
                                onClick={cancelEditProfile}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isProcessing} 
                                onClick={applyEditedProfile}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing' : 'Save'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                disabled={isProcessing} 
                                onClick={() => setEditMode(true)}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Edit Profile
                            </button>
                            <button 
                                type="button" 
                                disabled={isProcessing} 
                                onClick={() => deleteAccountMt.mutate()}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing' : 'Delete This Account'}
                            </button>
                        </div>
                    )}
                </div>
            )}
            <Navbar1/>
            <Navbar2/>
        </div>
    );
}