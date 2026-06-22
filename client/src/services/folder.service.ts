import { useMutation, useQueryClient, type Query } from "@tanstack/react-query";
import type { ChildFolderIntrf, FolderFormProps, FolderIntrf, FolderServieIntrf } from "../models/folder.model";
import { useState } from "react";
import DataModifier from "./data.service";
import AuthServices from "./auth.service";
import useSearch from "../hooks/useSearch";
import type { HybridIntrf } from "../models/hybrid.model";

export default function FolderServices(props?: FolderServieIntrf) {
    const queryClient = useQueryClient();
    const { currentUserId } = AuthServices();
    const { changeData, deleteData, getData, infiniteScroll, insertData } = DataModifier();
    
    const [folderName, setFolderName] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [folderToMove, setFolderToMove] = useState<string | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [selectedParentFolderId, setSelectedParentFolderId] = useState<string | null>(null);
    const { debouncedSearch, searchValue, setSearchValue } = useSearch();
    const [openFolderList, setOpenFolderList] = useState<boolean>(false);
    
    const changeFolderName = useMutation({
        mutationFn: async (data: Pick<FolderIntrf, '_id' | 'folder_name'>) => {
            return await changeData<FolderIntrf>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/remake/${data._id}`, 
                data: { folder_name: data.folder_name }
            });
        },
        onError: (error) => {
            props?.setMessage(error.message || 'Failed to change folder name or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            setSelectedFolderId(null);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favoried-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith('is-favorited') ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}-${props?.parent_folder_id}`);
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
            props?.setMessage(error.message || 'Failed to make folder');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`);
                    }
                    return false;
                }
            });
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
                        return queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`);
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
            props?.setMessage(error.message || 'Failed to move folder or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            setFolderToMove(null);
            setSelectedParentFolderId(null);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-${currentUserId}`) || 
                        queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}-${props?.parent_folder_id}`);
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
            props?.setMessage(error.message || 'Failed to move folder or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            setFolderToMove(null);
            setSelectedParentFolderId(null);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}-${props?.parent_folder_id}`);
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
            props?.setMessage(error.message || 'Failed to remove all folder');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`is-favorited-`);
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
            props?.setMessage(error.message || 'Failed to remove all folder');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`is-favorited-`);
                    }
                    return false;
                }
            });
        }
    });

    const removeOneFolderMt = useMutation({
        mutationFn: async (folder_id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/rm/${folder_id}` });
        },
        onError: (error) => {
            props?.setMessage(error.message || 'Failed to delete folder or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`is-favorited-`);
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
            props?.setMessage(error.message || 'Failed to delete folder or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-parent-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-folder-prev-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`is-favorited-`);
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

    const { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData } = infiniteScroll<HybridIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/parent-folder-only`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: debouncedSearch ? [`all-parent-folders-${currentUserId}-${debouncedSearch}`] : [`all-parent-folders-${currentUserId}`],
        stale_time: Infinity,
        searched: debouncedSearch.trim()
    });
    
    const foldersData = { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData };

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

    const isFolderProcessing = changeFolderName.isPending || makeChildFolderMt.isPending ||
    moveChildFolderToInsideMt.isPending || moveChildFolderToOutsideMt.isPending || removeAllChildFolderMt.isPending ||
    removeAllFolderMt.isPending || removeOneFolderMt.isPending || removeOneChildFolderMt.isPending;
    
    return { 
        changeFolderName, closeFolderList, foldersData, folderFormToggle, folderName, foldersPreviewData, getData, 
        isFolderProcessing, makeFolder, makeChildFolderMt, moveChildFolderToInsideMt, moveChildFolderToOutsideMt, 
        openForm, openFolderList, removeAllChildFolderMt, removeAllFolderMt, removeOneFolderMt, removeOneChildFolderMt, 
        searchValue, folderToMove, selectedFolderId, setSelectedParentFolderId, setFolderName, selectFolder, 
        setSearchValue, showFolderList
    }
}