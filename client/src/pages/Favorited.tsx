import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import type { FilesDataProps } from "../services/type.service";
import DataModifier from "../services/data.service";
import useAuth from "../services/auth.service";
import Loading from "../components/Loading";
import FavoriteList from "../components/FavoriteList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../services/useDebounce";
import Notification from "../components/Notification";
import { Trash } from "lucide-react";

export default function Favorited() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, message, setMessage } = DataModifier();
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);
    
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
    } = infiniteScroll<FilesDataProps>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/get-all/${currentUserId}`,
        limit: 14,
        query_key: debouncedSearch ? [`all-favorited-files-${currentUserId}-${debouncedSearch}`] : [`all-favorited-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 600000
    });

    const removeOneMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/erase/${id}` });
        },
        onError: () => {},
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${[currentUserId]}-${variables}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}-${debouncedSearch}`] });
        },
    });

    const removeAllMutation = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/erase-all/${currentUserId}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    // Cek apakah queryKey adalah array dan elemen pertamanya cocok dengan pola
                    const key = query.queryKey;
                    return Array.isArray(key) &&  key[0]?.toString().startsWith(`is-favorited-${[currentUserId]}`) && key.length === 3; // Pastikan panjangnya sesuai (is-favorited, [userId], fileId)
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}-${debouncedSearch}`] });
        },
    });

    const removeOne = (id: string) => {
        removeOneMutation.mutate(id);
    }

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
                    <button className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" type="button" onClick={removeAll}>
                        <Trash size={22}></Trash>
                    </button>
                </form>
                {paginatedData ? (
                    <FavoriteList 
                        fetchNextPage={fetchNextPage} 
                        favorites={paginatedData} 
                        isFetchingNextPage={isFetchingNextPage}
                        isReachedEnd={isReachedEnd} 
                        deleteOne={removeOne}
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