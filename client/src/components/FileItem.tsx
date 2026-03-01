import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FavoritedFileDataProps } from "../models/favoriteModel"
import type { FileItemProps } from "../models/fileModel";
import DataModifier from "../services/dataService";
import { Star, Trash } from "lucide-react";
import { useState } from "react";
import FileIcon from "./FileIcon";

export default function FileItem(props: FileItemProps) {
    const queryClient = useQueryClient();
    const { deleteData, getData, insertData } = DataModifier();
    const [isFavoriting, setIsFavoriting] = useState<boolean>(false);

    const { data: isFavorited } = getData<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/is-favorite?user_id=${props.file.user_id}&file_id=${props.file._id}`,
        query_key: [`is-favorited-${props.file.user_id}-${props.file._id}`],
        stale_time: 600000
    });

    const addToFavoriteMutation = useMutation({
        onMutate: () => setIsFavoriting(true),
        mutationFn: async () => {
            const getCurrentDate = new Date();
            await insertData<FavoritedFileDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/add`,
                data: {
                    created_at: getCurrentDate.toISOString(),
                    files: {
                        public_id: props.file.files.public_id,
                        resource_type: props.file.files.resource_type,
                        url: props.file.files.url
                    },
                    file_id: props.file._id,
                    file_name: props.file.file_name,
                    file_type: props.file.file_type,
                    user_id: props.file.user_id
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${props.file.user_id}-${props.file._id}`] });
        },
        onSettled: () => setIsFavoriting(false)
    });

    const deleteOneFileMutation = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase/${props.file._id}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${props.file.user_id}-${props.file._id}`] });
        }
    });

    const removeOneFavoriteMutation = useMutation({
        onMutate: () => setIsFavoriting(true),
        mutationFn: async (_id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/erase/${_id}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${props.file.user_id}-${props.file._id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
        },
        onSettled: () => setIsFavoriting(false)
    });

    function handleFavoriteButton() {
        if (isFavorited) removeOneFavoriteMutation.mutate(props.file._id);
        else addToFavoriteMutation.mutate();
    }

    return (
        <div className="border-gray-500 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            <FileIcon key={props.file._id} {...props.file}/>
            <hr className="bg-gray-500"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button 
                    type="button" 
                    disabled={isFavoriting}
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Star></Star>
                </button>
                <button type="button" onClick={() => deleteOneFileMutation.mutate()} className="cursor-pointer text-gray-500 font-[500] text-[1rem]">
                    <Trash></Trash>
                </button>
            </div>
        </div>
    );
}