import type { FavoriteItemProps } from "../models/favoriteModel";
import { Trash } from "lucide-react";
import FileIcon from "./FileIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DataModifier from "../services/dataService";

export default function FavoriteFile(props: FavoriteItemProps) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { deleteData } = DataModifier();
    
    const removeOneFavoriteMutation = useMutation({
        onMutate: () => setIsDeleting(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/erase/${props.file.file_id}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${props.file.user_id}-${props.file._id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
        },
        onSettled: () => setIsDeleting(false)
    });
    
    return (
        <div className="border border-gray-500 rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            <FileIcon key={props.file._id} {...props.file}/>
            <hr className="bg-gray-700"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button 
                    type="button" 
                    disabled={isDeleting}
                    onClick={() => removeOneFavoriteMutation.mutate()} 
                    className="cursor-pointer text-gray-700 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash></Trash>
                </button>
            </div>
        </div>
    );
}