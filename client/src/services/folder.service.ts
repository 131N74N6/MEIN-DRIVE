import { useMutation, useQueryClient, type Query } from "@tanstack/react-query";
import type { ChildFolderIntrf, FolderFormProps, FolderIntrf, FolderServieIntrf } from "../client_models/folder.client_model";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import DataModifier from "./data.service";
import type { FilesDataProps } from "../client_models/file.client_model";
import AuthServices from "./auth.service";

export default function FolderServices(props?: FolderServieIntrf) {
    const queryClient = useQueryClient();
    const { currentUserId } = AuthServices();
    const { changeData, deleteData, getData, message, infiniteScroll, insertData, setMessage } = DataModifier();
    
    const [folderName, setFolderName] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [folderToMove, setFolderToMove] = useState<string | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [selectedParentFolderId, setSelectedParentFolderId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);
    const [openFolderList, setOpenFolderList] = useState<boolean>(false);

    const addToFavoriteMt = useMutation({
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
        }
    });
    
    const changeFolderName = useMutation({
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
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    function folderFormToggle() {
        setOpenForm(!openForm);
        if (openForm === false) setFolderName('');
    }

    const makeFolderMutation = useMutation({
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
            queryClient.invalidateQueries({ queryKey: [`all-folder-prev-${currentUserId}`] });
            setOpenForm(false);
        },
        onSettled: () => {
            setFolderName('');
        }
    });

    const makeChildFolderMt = useMutation({
        mutationFn: async (parent_folder_id: string) => {
            await insertData<ChildFolderIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/make-child/${parent_folder_id}`,
                data: {
                    created_at: new Date().toISOString(),
                    folder_name: folderName.trim().replace(/\s+/g, '_'),
                    is_favorited: false,
                    parent_folder_id: parent_folder_id,
                    user_id: currentUserId!
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
            setOpenForm(false);
        }
    });

    function makeFolder(event: React.FormEvent) {
        event.preventDefault();
        makeFolderMutation.mutate();
    }

    const moveChildFolderToInsideMt = useMutation({
        mutationFn: async () => {
            return await changeData<FolderIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/move-inside/${folderToMove!}`,
                data: { parent_folder_id: selectedParentFolderId! }
            });
        },
        onError: (error: Error) => {
            setMessage(error.message || 'Failed to move folder or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            setFolderToMove(null);
            setSelectedParentFolderId(null);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    const moveChildFolderToOutsideMt = useMutation({
        mutationFn: async (_id: string) => {
            return await changeData<FolderIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/move-outside/${_id}`,
                data: {}
            });
        },
        onError: (error: Error) => {
            setMessage(error.message || 'Failed to move folder or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            setFolderToMove(null);
            setSelectedParentFolderId(null);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    const removeAllFolderMt = useMutation({
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm-all` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to remove all folder');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`) ||
                        queryKey[0].startsWith("is-folder-favorited-") ||
                        queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    const removeAllChildFolderMt = useMutation({
        mutationFn: async (parent_folder_id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm-all-childs/${parent_folder_id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to remove all folder');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`) ||
                        queryKey[0].startsWith("is-folder-favorited-") ||
                        queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    const removeFromFavoritedMt = useMutation({
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
        }
    });

    const removeOneFolderMt = useMutation({
        mutationFn: async (folder_id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm/${folder_id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete folder or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`) ||
                        queryKey[0].startsWith("is-folder-favorited-") ||
                        queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    const removeOneChildFolderMt = useMutation({
        mutationFn: async (folder_id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm-child/${folder_id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete folder or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`) ||
                        queryKey[0].startsWith("is-folder-favorited-") ||
                        queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-child-folders-${currentUserId}-${props?.parent_folder_id}`);
                    }
                    return false;
                }
            });
        }
    });

    function selectFolder(id: string) {
        setSelectedFolderId(prev => prev === id ? null : id);
    }

    function showFolderList(_id: string) {
        setFolderToMove(_id);
        setOpenFolderList(true);
    }

    function closeFolderList() {
        setOpenFolderList(false);
        setFolderToMove(null);
        setSelectedParentFolderId(null);
    }

    const { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/parent-folder-only`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: debouncedSearch ? [`all-folders-${currentUserId}-${debouncedSearch}`] : [`all-folders-${currentUserId}`],
        stale_time: Infinity,
        searched: debouncedSearch.trim()
    });
    
    const foldersData = { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData };

    const { 
        fetchNextPage: fetchFavoritedNextPage, isLoading: isFavoritedLoading, isFetchingNextPage: isFavoritedFetchingNextPage, 
        isReachedEnd: isFavoritedReachedEnd, error: favoritedError, paginatedData: favoritedPaginatedData 
    } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/favorited`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: [`all-favorited-folders-${currentUserId}`],
        stale_time: Infinity
    });

    const favoritedFoldersData = { 
        fetchNextPage: fetchFavoritedNextPage, isLoading: isFavoritedLoading, 
        isFetchingNextPage: isFavoritedFetchingNextPage, 
        isReachedEnd: isFavoritedReachedEnd, 
        error: favoritedError, 
        paginatedData: favoritedPaginatedData 
    }

    const { 
        fetchNextPage: fetchChildFolder, isLoading: isChildFolderLoading, isFetchingNextPage: isChildFolderFetchingNextPage, 
        isReachedEnd: isChildFolderReachedEnd, error: childFolderError, paginatedData: childFolderPaginatedData 
    } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/all-child-folder/${props?.parent_folder_id!}`,
        enabled: !!props?.parent_folder_id,
        limit: 14,
        query_key: [`all-child-folders-${currentUserId}-${props?.parent_folder_id}`],
        stale_time: Infinity
    });

    const childFoldersData = { fetchChildFolder, isChildFolderLoading, isChildFolderFetchingNextPage, isChildFolderReachedEnd, childFolderError, childFolderPaginatedData };

    const { 
        error: folderError, fetchNextPage: folderNext, isFetchingNextPage: folderHasNext, 
        isLoading: folderLoad, isReachedEnd: folderEnd, paginatedData: folderData 
    } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/all`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: [`all-folder-prev-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: Infinity
    });

    const foldersPreviewData = { folderError, folderNext, folderHasNext, folderLoad, folderEnd, folderData };

    const isFolderProcessing = addToFavoriteMt.isPending || changeFolderName.isPending || makeChildFolderMt.isPending ||
    moveChildFolderToInsideMt.isPending || moveChildFolderToOutsideMt.isPending || removeAllChildFolderMt.isPending ||
    removeAllFolderMt.isPending || removeFromFavoritedMt.isPending || removeOneFolderMt.isPending || removeOneChildFolderMt.isPending;
    
    return { 
        addToFavoriteMt, changeFolderName, childFoldersData, closeFolderList, foldersData, favoritedFoldersData, folderFormToggle, folderName, 
        foldersPreviewData, getData, isFolderProcessing, makeFolder, makeChildFolderMt, message, moveChildFolderToInsideMt, 
        moveChildFolderToOutsideMt, openForm, openFolderList, removeAllChildFolderMt, removeAllFolderMt, removeFromFavoritedMt, 
        removeOneFolderMt, removeOneChildFolderMt, searchValue, folderToMove, selectedFolderId, setSelectedParentFolderId, setFolderName, setMessage, 
        selectFolder, setSearchValue, showFolderList
    }
}