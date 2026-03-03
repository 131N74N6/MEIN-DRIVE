import { FolderPlus, Trash } from "lucide-react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import DataModifier from "../services/dataService";
import type { FolderIntrf } from "../models/folderModel";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import FolderForm from "../components/FolderForm";
import type { FileInFolderIntrf } from "../models/fileModel";
import FileList from "../components/FileList";

export default function Files() {
    const { user_id } = useParams();
    const currentUserId = user_id ? user_id : '';
    const queryQlient = useQueryClient();

    const { infiniteScroll, insertData } = DataModifier();
    const { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData } = infiniteScroll<FileInFolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folder/get/${currentUserId}`,
        limit: 14,
        query_key: [`all-folders-${currentUserId}`],
        stale_time: 1200000
    });
    
    const [folderName, setFolderName] = useState<string>('');
    const [isMaking, setIsMaking] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);

    const makeFolderMutation = useMutation({
        onMutate: () => setIsMaking(true),
        mutationFn: async () => {
            await insertData<FolderIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folder/make`,
                data: {
                    created_at: new Date().toLocaleString(),
                    folder_name: folderName.trim(),
                    user_id: currentUserId
                }
            });
        },
        onSuccess: () => {
            setOpenForm(false);
            queryQlient.invalidateQueries({ queryKey: [`all-folder-${currentUserId}`] });
        },
        onError: () => {},
        onSettled: () => {
            setIsMaking(false);
            setFolderName('');
        }
    });

    function makeFolder(event: React.FormEvent) {
        event.preventDefault();
        makeFolderMutation.mutate();
    }

    function folderFormToggle() {
        setOpenForm(!openForm);
    }

    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            {openForm ? <FolderForm closed_form={folderFormToggle} folder_name={folderName} is_making={isMaking} set_folder_name={setFolderName} submit_folder={makeFolder}/> : null}
            <div className="w-full md:w-3/4 flex flex-col gap-x-4 h-full min-h-[200px] rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-[1rem] items-center pt-[1rem] px-[1rem]">
                    <input
                        type="text"
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search folder here"
                    />
                    <button 
                        type="button"
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded"
                    >
                        <Trash size={22}/>
                    </button>
                    <button 
                        type="button"
                        onClick={folderFormToggle}
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded"
                    >
                        <FolderPlus size={22}/>
                    </button>
                </form>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : paginatedData ? (
                    <FileList 
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