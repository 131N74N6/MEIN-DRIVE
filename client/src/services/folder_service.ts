import { useMutation, useQueryClient, type Query } from "@tanstack/react-query";
import type { FolderFormProps, FolderIntrf } from "../models/folder_model";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import DataModifier from "./data_service";
import type { FilesDataProps } from "../models/file_model";
import AuthServices from "./auth_service";

export default function FolderServices() {
    const queryClient = useQueryClient();
    const { currentUserId } = AuthServices();
    const { changeData, deleteData, getData, message, infiniteScroll, insertData, setMessage } = DataModifier();
    
    const [folderName, setFolderName] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);

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

    function folderFormToggle() {
        setOpenForm(!openForm);
        if (openForm === false) setFolderName('');
    }

    const makeFolderMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await insertData<FolderFormProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/make`,
                data: {
                    created_at: new Date().toISOString(),
                    folder_name: folderName.trim().replace(/\s+/g, '_'),
                    user_id: currentUserId!
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

    function makeFolder(event: React.FormEvent) {
        event.preventDefault();
        makeFolderMutation.mutate();
    }

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
                        return queryKey[0].startsWith(`is-file-favorited-`) ||
                        queryKey[0].startsWith("is-folder-favorited-");
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
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

    function selectFolder(id: string) {
        setSelectedFolderId(prev => prev === id ? null : id);
    }

    const { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/get/${currentUserId}`,
        limit: 14,
        query_key: debouncedSearch ? [`all-folders-${currentUserId}-${debouncedSearch}`] : [`all-folders-${currentUserId}`],
        stale_time: 1200000,
        searched: debouncedSearch.trim()
    });

    const { 
            fetchNextPage: fetchFavoritedNextPage, isLoading: isFavoritedLoading, isFetchingNextPage: isFavoritedFetchingNextPage, 
            isReachedEnd: isFavoritedReachedEnd, error: favoritedError, paginatedData: favoritedPaginatedData 
        } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/favorited/${currentUserId}`,
        limit: 14,
        query_key: [`all-favorited-folders-${currentUserId}`],
        stale_time: 1200000
    });

    const foldersData = { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData }
    
    const favoritedFoldersData = { 
        fetchNextPage: fetchFavoritedNextPage, isLoading: isFavoritedLoading, 
        isFetchingNextPage: isFavoritedFetchingNextPage, 
        isReachedEnd: isFavoritedReachedEnd, 
        error: favoritedError, 
        paginatedData: favoritedPaginatedData 
    }

    return { 
        addToFavoriteMt, changeFolderName, foldersData, favoritedFoldersData, folderFormToggle, folderName, getData, isProcessing, makeFolder, 
        message, openForm, removeAllFolderMt, removeFromFavoritedMt, removeOneFolderMt, searchValue, selectedFolderId, 
        setFolderName, setMessage, selectFolder, setSearchValue 
    }
}