import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/dataService";
import useAuth from "../services/authService";
import type { FilesDataProps } from "../models/fileModel";
import FileList from "../components/FileList";
import Loading from "../components/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../services/useDebounce";
import Notification from "../components/Notification";
import { Trash } from "lucide-react";

export default function Home() {
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
        paginatedData 
    } = infiniteScroll<FilesDataProps>({
        api_url: currentUserId ? `${import.meta.env.VITE_API_BASE_URL}/files/get-all/${currentUserId}` : '',
        limit: 14,
        query_key: debouncedSearch ? [`all-files-${currentUserId}-${debouncedSearch}`] : [`all-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 600000
    });

    const deleteFileMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase/${id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or chech your internet connection.');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${[currentUserId]}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
        }
    });

    const deleteAllFilesMutation = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or chech your internet connection.');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${[currentUserId]}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
        },
    });

    const deleteOneFile = (id: string) => {
        deleteFileMutation.mutate(id);
    }

    const deleteAllFiles = () => {
        deleteAllFilesMutation.mutate();
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
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                    <button className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" type="button" onClick={deleteAllFiles}>
                        <Trash size={22}></Trash>
                    </button>
                </form>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : paginatedData ? (
                    <FileList 
                        deleteOne={deleteOneFile}
                        fetchNextPage={fetchNextPage} 
                        files={paginatedData} 
                        isFetchingNextPage={isFetchingNextPage}
                        isReachedEnd={isReachedEnd} 
                    />
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