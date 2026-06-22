import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import AuthServices from "./auth.service";
import DataModifier from "./data.service";
import useSearch from "../hooks/useSearch";
import type { HybridIntrf, HybridServiceIntrf } from "../models/hybrid.model";

export default function HybridServices(props?: HybridServiceIntrf) {
    const { currentUserId } = AuthServices();
    const { changeData, getData, infiniteScroll } = DataModifier();
    const queryClient = useQueryClient();
    
    const { debouncedSearch, searchValue, setSearchValue } = useSearch();

    const { 
        error: fileError, fetchNextPage: fileNext, isFetchingNextPage: fileHasNext, 
        isLoading: fileLoad, isReachedEnd: fileEnd, paginatedData: fileData 
    } = infiniteScroll<HybridIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/hybrids/all`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: debouncedSearch ? [`all-${currentUserId}-${debouncedSearch}`] : [`all-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: Infinity
    });

    const allFilesAndFolders = { fileError, fileNext, fileHasNext, fileLoad, fileEnd, fileData };

    const { 
        error: fcfError, fetchNextPage: fetchNextFCF, isFetchingNextPage: fcfHasNext, 
        isLoading: fcfisLoading, isReachedEnd: fcfReachEnd, paginatedData: fcfData 
    } = infiniteScroll<HybridIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/hybrids/fi-and-cfo/${props?.parent_folder_id}`,
        enabled: !!currentUserId && !!props?.parent_folder_id,
        limit: 14,
        query_key: debouncedSearch ? [`files-and-child-folders-${currentUserId}-${props?.parent_folder_id}-${debouncedSearch}`] : [`files-and-child-folders-${currentUserId}-${props?.parent_folder_id}`],
        searched: debouncedSearch.trim(),
        stale_time: Infinity
    });

    const allFilesAndChildFolders = { fcfError, fetchNextFCF, fcfHasNext, fcfisLoading, fcfReachEnd, fcfData };

    const { 
        error: fileError3, fetchNextPage: fileNext3, isFetchingNextPage: fileHasNext3, 
        isLoading: fileLoad3, isReachedEnd: fileEnd3, paginatedData: fileData3 
    } = infiniteScroll<HybridIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/hybrids/favorited`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: debouncedSearch ? [`all-favorited-${currentUserId}-${debouncedSearch}`] : [`all-favorited-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: Infinity
    });

    const favoritedFilesAndFolders = { fileError3, fileNext3, fileHasNext3, fileLoad3, fileEnd3, fileData3 };
    
    const addToFavoriteMt = useMutation({
        mutationFn: async (id: string) => {
            return await changeData<HybridIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/hybrids/add-to-favorited/${id}`,
                data: {}
            });
        },
        onError: (error) => {
            props?.setMessage(error.message || 'Failed to add to favorites or check your internet connection.'!);
        },
        onSuccess: (response) => {
            props?.setMessage(response.message!);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith('is-favorited-');
                    }
                    return false;
                }
            });
        }
    });

    const removeFromFavoritedMt = useMutation({
        mutationFn: async (id: string) => {
            return await changeData<HybridIntrf>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/hybrids/remove-from-favorited/${id}`, 
                data: {}
            });
        },
        onError: (error: Error) => {
            props?.setMessage(error.message || 'Failed to remove from favorited or check your internet connection'!);
        },
        onSuccess: (response) => {
            props?.setMessage(response.message!);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith('is-favorited-') ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`)
                    }
                    return false;
                }
            });
        }
    });

    const isHybridProcessing = addToFavoriteMt.isPending || removeFromFavoritedMt.isPending;

    return { addToFavoriteMt, allFilesAndFolders, allFilesAndChildFolders, favoritedFilesAndFolders, getData, isHybridProcessing, removeFromFavoritedMt, searchValue, setSearchValue }
}