import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/dataService";
import useAuth from "../services/authService";
import Loading from "../components/Loading";
import FavoriteList from "../components/FavoriteList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../services/useDebounce";
import Notification from "../components/Notification";
import { Trash } from "lucide-react";
import type { FavoritedFileDataProps } from "../models/favoriteModel";

export default function Favorited() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, message, setMessage } = DataModifier();
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const {
        error,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isReachedEnd,
        paginatedData,
    } = infiniteScroll<FavoritedFileDataProps>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/get-all/${currentUserId}`,
        limit: 14,
        query_key: debouncedSearch ? [`all-favorited-files-${currentUserId}-${debouncedSearch}`] : [`all-favorited-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 600000
    });

    const removeAllMutation = useMutation({
        onMutate: () => setIsDeleting(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/erase-all/${currentUserId}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    // Pastikan query key adalah array dan elemen pertama adalah string
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        // Cocokkan apakah elemen pertama dimulai dengan pola 'is-favorited-{currentUserId}-'
                        return queryKey[0].startsWith(`is-favorited-${currentUserId}-`);
                    }
                    return false; // Abaikan jika format tidak sesuai
                }
            });
        },
        onSettled: () => setIsDeleting(false)
    });

    const removeAll = () => {
        removeAllMutation.mutate();
    }

    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            {message ? Notification(message) : null}
            <div className="flex flex-col gap-x-[1rem] md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white overflow-y-auto">
                <form className="flex gap-[1rem] items-center pt-[1rem] px-[1rem]">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="rounded border border-gray-700 w-[100%] p-[0.45rem] text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                    <button 
                        type="button" 
                        onClick={removeAll}
                        disabled={isDeleting}
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash size={22}></Trash>
                    </button>
                </form>
                {paginatedData ? (
                    <FavoriteList 
                        fetchNextPage={fetchNextPage} 
                        favorites={paginatedData} 
                        isFetchingNextPage={isFetchingNextPage}
                        isReachedEnd={isReachedEnd} 
                    />
                ) : isLoading ? (
                    <div className="flex justify-center items-center h-[100%]">
                        <Loading/>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{error.message}</span>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">Failed to get posts</span>
                    </div>
                )}
            </div>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}