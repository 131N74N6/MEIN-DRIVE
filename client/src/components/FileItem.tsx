import type { FileItemProps } from "../models/file_model";
import { FolderUp, MoveLeft, Star, Trash } from "lucide-react";
import { FileIcon } from "./FileIcon";

export default function FileItem(props: FileItemProps) {
    const { data: isFavorited } = props.get_data<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/is-favorited/${props.file._id}`,
        query_key: [`is-file-favorited-${props.file._id}`],
        stale_time: 1200000
    });

    function handleFavoriteButton() {
        if (isFavorited) props.remove_from_favorite.mutate(props.file._id);
        else props.add_to_favorite.mutate(props.file._id);
    }

    return (
        <div className="border-gray-500 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            <FileIcon key={props.file._id} {...props.file}/>
            <hr className="bg-gray-500"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Star></Star>
                </button>
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={() => props.on_delete.mutate(props.file._id)} 
                    className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash></Trash>
                </button>
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={() => props.showFolderList(props.file._id)} 
                    className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FolderUp></FolderUp>
                </button>
                {props.is_in_folder ? (
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        onClick={() => props.move_outside_folder.mutate(props.file._id)} 
                        className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MoveLeft/>
                    </button>
                ) : null}
            </div>
        </div>
    );
}