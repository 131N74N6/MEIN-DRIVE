import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/data-modifier";
import useAuth from "../services/useAuth";
import type { FavoritedFileDataProps, FilesDataProps } from "../services/custom-types";
import FileList from "../components/FileList";
import Loading from "../components/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../services/useDebounce";
import Notification from "../components/Notification";

export default function Home() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, insertData } = DataModifier();
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
        paginatedData 
    } = infiniteScroll<FilesDataProps>({
        api_url: currentUserId ? `http://localhost:1234/files/get-all/${currentUserId}` : '',
        limit: 14,
        query_key: debouncedSearch ? [`all-files-${currentUserId}-${debouncedSearch}`] : [`all-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 600000
    });

    const addToFavoriteMutation = useMutation({
        mutationFn: async (selected_file: FilesDataProps) => {
            const getCurrentDate = new Date();
            await insertData<FavoritedFileDataProps>({
                api_url: `http://localhost:1234/favorited/add`,
                data: {
                    created_at: getCurrentDate.toISOString(),
                    files: {
                        public_id: selected_file.files.public_id,
                        resource_type: selected_file.files.resource_type,
                        url: selected_file.files.url
                    },
                    file_id: selected_file._id,
                    file_name: selected_file.file_name,
                    file_type: selected_file.file_type,
                    user_id: currentUserId
                }
            });
        },
        onError: () => {
            setErrorMsg('Failed to add to favorite');
            setShowErrorMsg(true);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}-${debouncedSearch}`] }),
    });

    const deleteFileMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `http://localhost:1234/files/erase/${id}` });
        },
        onError: () => {
            setErrorMsg('Failed to delete file');
            setShowErrorMsg(true);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}-${debouncedSearch}`] }),
    });

    const deleteAllFilesMutation = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `http://localhost:1234/files/erase-all/${currentUserId}` });
        },
        onError: () => {
            setErrorMsg('Failed to delete all files');
            setShowErrorMsg(true);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}-${debouncedSearch}`] }),
    });

    const addToFavorite = (selected_file: FilesDataProps) => {
        addToFavoriteMutation.mutate(selected_file);
    }

    const deleteOneFile = (id: string) => {
        deleteFileMutation.mutate(id);
    }

    const deleteAllFiles = () => {
        deleteAllFilesMutation.mutate();
    }

    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            {showErrorMsg ? <Notification message={errorMsg}/> : null}
            <div className="flex flex-col gap-x-[1rem] md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white overflow-y-auto">
                <form className="flex gap-[1rem] items-center px-[1rem] pt-[1rem]">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border rounded border-gray-700 p-[0.45rem] text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                    <button className="cursor-pointer outline-0 w-[60px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" type="button" onClick={deleteAllFiles}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </form>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : paginatedData ? (
                    <FileList 
                        addToFavorite={addToFavorite}
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