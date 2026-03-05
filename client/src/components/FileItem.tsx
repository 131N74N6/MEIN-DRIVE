import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FileItemProps, FilesDataProps } from "../models/fileModel";
import DataModifier from "../services/dataService";
import { FolderUp, Star, Trash } from "lucide-react";
import { useState } from "react";
import { FileIcon } from "./FileIcon";

export default function FileItem(props: FileItemProps) {
    const queryClient = useQueryClient();
    const { changeData, deleteData, getData } = DataModifier();
    const [IsProcessing, setIsProcessing] = useState<boolean>(false);

    const { data: isFavorited } = getData<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/is-favorited/${props.file._id}`,
        query_key: [`is-file-favorited-${props.file._id}`],
        stale_time: 1200000
    });

    const addToFavoriteMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add-to-favorited/${props.file._id}`,
                data: {}
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-file-favorited-${props.file._id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteOneFileMt = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase/${props.file._id}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-file-favorited-${props.file._id}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-${props.file.user_id}-`);
                    }
                    return false; 
                }
            });
        }
    });

    const removeFromFavoritedMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await changeData<FilesDataProps>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/remove-from-favorited/${props.file._id}`, 
                data: {}
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`is-file-favorited-${props.file._id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    function handleFavoriteButton() {
        if (isFavorited) removeFromFavoritedMt.mutate();
        else addToFavoriteMt.mutate();
    }

    return (
        <div className="border-gray-500 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            <FileIcon key={props.file._id} {...props.file}/>
            <hr className="bg-gray-500"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button 
                    type="button" 
                    disabled={IsProcessing}
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Star></Star>
                </button>
                <button 
                    type="button" 
                    disabled={IsProcessing}
                    onClick={() => deleteOneFileMt.mutate()} 
                    className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash></Trash>
                </button>
                <button 
                    type="button" 
                    disabled={IsProcessing}
                    onClick={() => props.showFolderList(props.file._id)} 
                    className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FolderUp></FolderUp>
                </button>
            </div>
        </div>
    );
}