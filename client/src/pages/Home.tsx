import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/dataService";
import type { FilesDataProps } from "../models/fileModel";
import FileList from "../components/FileList";
import Loading from "../components/Loading";
import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../services/useDebounce";
import Notification from "../components/Notification";
import { Trash } from "lucide-react";
import { FolderListPreview } from "../components/FolderList";
import type { FolderIntrf } from "../models/folderModel";
import { useParams } from "react-router-dom";

export default function Home() {
    const { user_id } = useParams();
    const { changeData, deleteData, infiniteScroll, message, setMessage } = DataModifier();
    const queryClient = useQueryClient();
    const currentUserId = user_id ? user_id : '';
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);

    const [chosenFileId, setChosenFileId] = useState<string | null>(null);
    const [chosenFolder, setChosenFolder] = useState<string | null>(null);
    const [openFolderList, setOpenFolderList] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);
    
    const { error: aa, fetchNextPage: ab, isFetchingNextPage: ac, isLoading: ad, isReachedEnd: ae, paginatedData: af } = infiniteScroll<FilesDataProps>({
        api_url: currentUserId ? `${import.meta.env.VITE_API_BASE_URL}/files/get-all/${currentUserId}` : '',
        limit: 14,
        query_key: debouncedSearch ? [`all-files-${currentUserId}-${debouncedSearch}`] : [`all-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 1200000
    });

    const { error: ba, fetchNextPage: bb, isFetchingNextPage: bc, isLoading: bd, isReachedEnd: be, paginatedData: bf } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/get/${currentUserId}`,
        limit: 14,
        query_key: [`all-folder-prev-${currentUserId}`],
        stale_time: 1200000
    });

    const deleteAllFilesMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or chech your internet connection.');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false; 
                }
            });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    // Memastikan query key adalah array dan elemen pertama adalah string
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        // Cocokkan apakah elemen pertama dimulai dengan pola 'is-file-favorited'
                        return queryKey[0].startsWith(`is-file-favorited-`);
                    }
                    return false; // Abaikan jika format tidak sesuai
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    const insertFileToFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            if (!chosenFolder || !chosenFileId) return;
            await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add-to-folder/${chosenFileId}`,
                data: { folder_name: chosenFolder.trim() }
            });
        },
        onSuccess: () => {
            setOpenFolderList(false);
            setChosenFileId(null);
            setChosenFolder(null);
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false; 
                }
            });
        },
        onSettled: () => {
            setIsProcessing(false);
        }
    });

    function closeFolderList() {
        setOpenFolderList(false);
        setChosenFileId(null);
        setChosenFolder(null);
    }

    function showFolderList(_id: string) {
        setChosenFileId(_id);
        setOpenFolderList(true);
    }

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            {message ? Notification(message) : null}
            {openFolderList ? (
                <FolderListPreview 
                    error={ba}
                    fetchNextPage={bb} 
                    folder_prev={bf} 
                    isLoading={bd}
                    isFetchingNextPage={bc} 
                    isReachedEnd={be}
                    move={insertFileToFolderMt}
                    toggle={closeFolderList}
                    set_chosen_folder={setChosenFolder}
                /> 
            ) : null}
            <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-4 items-center pt-4 px-4">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                    <button 
                        type="button" 
                        disabled={isProcessing}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" 
                        onClick={() => deleteAllFilesMt.mutate()}
                    >
                        <Trash size={22}></Trash>
                    </button>
                </form>
                {ad ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : af ? (
                    <FileList 
                        fetchNextPage={ab} 
                        files={af} 
                        isFetchingNextPage={ac}
                        isReachedEnd={ae} 
                        showFolderList={showFolderList}
                    />
                ) : aa ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{aa.message}</span>
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