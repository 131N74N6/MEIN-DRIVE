import { Folder, LucideCheckSquare2, Pen, Star, Trash, X } from "lucide-react";
import type { FolderItemIntrf, FolderItemPrevIntrf } from "../models/folder_model";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function FolderItem(props: FolderItemIntrf) {
    const [folderName, setFolderName] = useState<string>('');

    useEffect(() => {
        if (props.is_selected) {
            setFolderName(props.folder_name);
        } else {
            setFolderName('');
        }
    }, [props.is_selected, props._id]);

    const { data: isFavorited } = props.get_data<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/is-favorited/${props._id}`,
        query_key: [`is-folder-favorited-${props._id}`],
        stale_time: 1200000
    });
    
    function updateFolderName(event: React.FormEvent) {
        event.preventDefault();
        props.on_edit.mutate({ _id: props._id, folder_name: folderName.trim() });
    }

    function handleFavoriteButton() {
        if (isFavorited) props.remove_from_favorite.mutate(props._id);
        else props.add_to_favorite.mutate(props._id);
    }
    
    const cancel = () => props.on_select(props._id);
    
    if (props.is_selected) {
        return (
            <form onSubmit={updateFolderName} className="border border-gray-600 flex p-4 justify-between rounded-md items-center">
                <div className="flex gap-2 items-center">
                    <Folder/>
                    <input 
                        type="text"
                        value={folderName}
                        className="border border-gray-600 p-2 text-md text-gray-700 rounded-md" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFolderName(event.target.value)}
                    />
                    <p>{new Date(props.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button 
                        type="submit" 
                        disabled={props.is_processing}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LucideCheckSquare2/>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        onClick={cancel}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X/>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center">
            <div className="flex gap-2 items-center">
                <Folder/>
                <Link to={`/folder-files/${props.folder_name}`}>
                    <p className="line-clamp-1">{props.folder_name}</p>
                </Link>
                <p>{new Date(props.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-3 items-center">
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={() => props.on_delete.mutate(props._id)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash/>
                </button>
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={() => props.on_select(props._id)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Pen/>
                </button>
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Star/>
                </button>
            </div>
        </div>
    );
}

export function FolderItemPreview(props: FolderItemPrevIntrf) {
    function moveToFolder() {
        props.set_chosen_folder(props.folder_name); 
        props.move.mutate();
    };
    
    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center cursor-pointer" onClick={moveToFolder}>
            <div className="flex gap-2 items-center">
                <Folder/>
                <div className="line-clamp-1">{props.folder_name}</div>
            </div>
        </div>
    );
}