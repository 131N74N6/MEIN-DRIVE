import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import type { FilesDataProps } from "../services/custom-types";
import DataModifier from "../services/data-modifier";
import useAuth from "../services/useAuth";
import Loading from "../components/Loading";
import FavoriteList from "../components/FavoriteList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../services/useDebounce";
import Notification from "../components/Notification";

export default function Favorited() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll } = DataModifier();
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);
    
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
    
    useEffect(() => {
        if (showErrorMsg) {
            const timer = setTimeout(() => {
                setShowErrorMsg(false);
                setErrorMsg(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showErrorMsg]);

    const {
        error,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isReachedEnd,
        paginatedData,
    } = infiniteScroll<FilesDataProps>({
        api_url: currentUserId ? `http://localhost:1234/favorited/get-all/${currentUserId}` : currentUserId,
        limit: 14,
        query_key: [`all-favorited-files-${currentUserId}-${debouncedSearch}`],
        searched: debouncedSearch.trim(),
        stale_time: 600000
    });

    const removeOneMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `http://localhost:1234/favorited/erase/${id}` });
        },
        onError: () => {
            setErrorMsg('Failed to remove favorite file');
            setShowErrorMsg(true);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}-${debouncedSearch}`] }),
    });

    const removeAllMutation = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `http://localhost:1234/favorited/erase-all/${currentUserId}` });
        },
        onError: () => {
            setErrorMsg('Failed to remove all favorite files');
            setShowErrorMsg(true);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}-${debouncedSearch}`] }),
    });

    const removeOne = (id: string) => {
        removeOneMutation.mutate(id);
    }

    const removeAll = () => {
        removeAllMutation.mutate();
    }

    return (
        <section className="flex gap-[1rem] md:flex-row flex-col h-screen p-[1rem]">
            {showErrorMsg ? <Notification message={errorMsg}/> : null}
            <div className="flex flex-col p-[1rem] gap-[1rem] md:w-3/4 h-[100%] min-h-[200px] w-full shadow-[0_0_4px_#1a1a1a] rounded bg-white">
                <form className="flex gap-[1rem] items-center px-[1rem] pt-[1rem]">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border border-gray-700 p-[0.45rem] text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                    <button className="cursor-pointer text-gray-700 text-[0.9rem]" type="button" onClick={removeAll}>
                        <i className="fa-solid fa-trash"></i>
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