import { useMutation, useQueryClient, type Query } from "@tanstack/react-query";
import type { ChildFolderIntrf, FolderFormProps, FolderIntrf, FolderServieIntrf } from "../models/folder_model";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import DataModifier from "./data.service";
import type { FilesDataProps } from "../models/file_model";
import AuthServices from "./auth.service";

export default function FolderServices(props?: FolderServieIntrf) {
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
            return await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/add-to-favorited/${id}`,
                data: {}
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to add to favorite');
        },
        onSuccess: (response) => {
            setMessage(response.message);
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
            return await changeData<FolderIntrf>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/change/${data._id}`, 
                data: { folder_name: data.folder_name }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to change folder name or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
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
            return await insertData<FolderFormProps>({
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
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`all-folders-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${currentUserId}`] });
            setOpenForm(false);
        },
        onSettled: () => {
            setIsProcessing(false);
            setFolderName('');
        }
    });

    const makeChildFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (parent_folder_id: string) => {
            await insertData<ChildFolderIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/make-child/${parent_folder_id}`,
                data: {
                    created_at: new Date().toLocaleString(),
                    folder_name: folderName.trim().replace(/\s+/g, '_'),
                    is_favorited: false,
                    parent_folder_id: parent_folder_id,
                    user_id: currentUserId!
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-folders-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-child-folders-${currentUserId}`] });
            setOpenForm(false);
        },
        onSettled: () => setIsProcessing(false)
    });

    function makeFolder(event: React.FormEvent) {
        event.preventDefault();
        makeFolderMutation.mutate();
    }

    const removeAllFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm-all` });
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
        onSuccess: (response) => {
            setMessage(response.message);
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
        mutationFn: async (folder_id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm/${folder_id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete folder or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
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
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/parent-folder-only`,
        limit: 14,
        query_key: debouncedSearch ? [`all-folders-${currentUserId}-${debouncedSearch}`] : [`all-folders-${currentUserId}`],
        stale_time: 1200000,
        searched: debouncedSearch.trim()
    });

    const { 
        fetchNextPage: fetchFavoritedNextPage, isLoading: isFavoritedLoading, isFetchingNextPage: isFavoritedFetchingNextPage, 
        isReachedEnd: isFavoritedReachedEnd, error: favoritedError, paginatedData: favoritedPaginatedData 
    } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/favorited`,
        limit: 14,
        query_key: [`all-favorited-folders-${currentUserId}`],
        stale_time: 1200000
    });

    const foldersData = { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData }

    const { 
        fetchNextPage: fetchChildFolder, isLoading: isChildFolderLoading, isFetchingNextPage: isChildFolderFetchingNextPage, 
        isReachedEnd: isChildFolderReachedEnd, error: childFolderError, paginatedData: childFolderPaginatedData 
    } = infiniteScroll<FolderIntrf>({
        api_url: props && props.parent_folder_id ? `${import.meta.env.VITE_API_BASE_URL}/folders/all-child-folder/${props.parent_folder_id!}` : '',
        limit: 14,
        query_key: [`all-child-folders-${currentUserId}`],
        stale_time: 1200000
    });

    const childFoldersData = { fetchChildFolder, isChildFolderLoading, isChildFolderFetchingNextPage, isChildFolderReachedEnd, childFolderError, childFolderPaginatedData }
    
    const favoritedFoldersData = { 
        fetchNextPage: fetchFavoritedNextPage, isLoading: isFavoritedLoading, 
        isFetchingNextPage: isFavoritedFetchingNextPage, 
        isReachedEnd: isFavoritedReachedEnd, 
        error: favoritedError, 
        paginatedData: favoritedPaginatedData 
    }

    return { 
        addToFavoriteMt, changeFolderName, childFoldersData, foldersData, favoritedFoldersData, folderFormToggle, folderName, getData, 
        isProcessing, makeFolder, makeChildFolderMt, message, openForm, removeAllFolderMt, removeFromFavoritedMt, removeOneFolderMt, 
        searchValue, selectedFolderId, setFolderName, setMessage, selectFolder, setSearchValue 
    }
}