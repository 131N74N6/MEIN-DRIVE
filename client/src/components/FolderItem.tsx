import { EllipsisVertical, Folder, LucideCheckSquare2, X } from "lucide-react";
import type { FolderItemIntrf } from "../models/folder_model";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowOption from "../hooks/useShowOption";
import FolderItemOption from "./FolderItemOption";

export default function FolderItem(props: FolderItemIntrf) {
    const [folderName, setFolderName] = useState<string>('');
    const { showOption, handleShowOption } = useShowOption();

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
            <form onSubmit={updateFolderName} className="border-gray-500 text-gray-600 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
                <div className="flex gap-2 items-center">
                    <Folder/>
                    <input 
                        type="text"
                        value={folderName}
                        className="border border-gray-600 p-2 text-md text-gray-700 rounded-md" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFolderName(event.target.value)}
                    />
                </div>
                <div className="flex gap-3 flex-col">
                    <button 
                        type="submit" 
                        disabled={props.is_processing}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <LucideCheckSquare2/>
                            <div className="font-medium">Save Change</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        onClick={cancel}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <X/>
                            <div className="font-medium">Cancel Change</div>
                        </div>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="border-gray-500 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            {showOption ? (
                <FolderItemOption
                    _id={props._id}
                    created_at={props.created_at}
                    handle_favorite={handleFavoriteButton}
                    is_favorited={isFavorited!}
                    is_processing={props.is_processing}
                    on_delete={props.on_delete}
                    on_select={props.on_select}
                    show_more_options={handleShowOption}
                />
            ) : (
                <>
                    <div className="flex gap-2 flex-col">
                        <Link to={`/folder-files/${props._id}`}>
                            <div className="flex justify-center items-center aspect-square text-gray-500 text-[2rem] border border-gray-500 rounded">
                                <Folder></Folder>
                            </div>
                        </Link>
                    </div>
                    <hr className="bg-gray-500"/>
                    <div className="flex justify-between">
                        <button 
                            type="button" 
                            disabled={props.is_processing}
                            onClick={handleShowOption}
                            className='cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed text-gray-500'
                        >
                            <EllipsisVertical/>
                        </button>
                        <div className="line-clamp-1">{props.folder_name}</div>
                    </div>
                </>
            )}
        </div>
    );
}