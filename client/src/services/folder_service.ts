import { useMutation, useQueryClient, type Query } from "@tanstack/react-query";
import type { FolderFormProps, FolderIntrf } from "../models/folder_model";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import DataModifier from "./data_service";
import type { FilesDataProps } from "../models/file_model";

export default function FolderServices(user_id: string | undefined) {
    const currentUserId = user_id ? user_id : '';
    const queryClient = useQueryClient();
    const { changeData, deleteData, message, infiniteScroll, insertData, setMessage } = DataModifier();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);
    
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);

    const { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/get/${currentUserId}`,
        limit: 14,
        query_key: debouncedSearch ? [`all-folders-${currentUserId}-${debouncedSearch}`] : [`all-folders-${currentUserId}`],
        stale_time: 1200000,
        searched: debouncedSearch.trim()
    });

    const folderData = { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData }
    
    const [folderName, setFolderName] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    const changeFolderName = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (data: Pick<FolderIntrf, '_id' | 'folder_name'>) => {
            await changeData<FolderIntrf>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/change/${data._id}`, 
                data: { folder_name: data.folder_name }
            });
        },
        onSuccess: () => {
            setSelectedFolderId(null);
            queryClient.invalidateQueries({ queryKey: [`all-folders-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const makeFolderMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await insertData<FolderFormProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/make`,
                data: {
                    created_at: new Date().toISOString(),
                    folder_name: folderName.trim().replace(/\s+/g, '_'),
                    user_id: currentUserId
                }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to make folder');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-folders-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${currentUserId}`] });
            setOpenForm(false);
        },
        onSettled: () => {
            setIsProcessing(false);
            setFolderName('');
        }
    });

    const removeAllFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/deletes/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to remove all folder');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`all-folders-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith("is-folder-favorited-");
                    }
                    return false;
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    function selectFolder(id: string) {
        setSelectedFolderId(prev => prev === id ? null : id);
    }

    const addToFavoriteMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/add-to-favorited/${id}`,
                data: {}
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to add to favorite');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-favorited-folders-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-folder-favorited-`);
                    }
                    return false;
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    const removeFromFavoritedMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            return await changeData<FilesDataProps>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/remove-from-favorited/${id}`, 
                data: {}
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to remove from favorite');
        },
        onSuccess: () => {
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-folder-favorited-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-folders-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const removeOneFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (folder_name: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/delete/${currentUserId}/${folder_name}` });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-folders-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`) ||
                        queryKey[0].startsWith(`is-folder-favorited-`);;
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });
    
    // function updateFolderName(event: React.FormEvent) {
    //     event.preventDefault();
    //     props.changeOne.mutate({ _id: props._id, folder_name: folderName.trim() });
    // }

    // function handleFavoriteButton() {
    //     if (isFavorited) removeFromFavoritedMt.mutate();
    //     else addToFavoriteMt.mutate();
    // }

    return { addToFavoriteMt, changeFolderName, folderData, isProcessing, makeFolderMutation, openForm, removeAllFolderMt, removeFromFavoritedMt, removeOneFolderMt, searchValue, selectedFolderId, selectFolder, setSearchValue }
}