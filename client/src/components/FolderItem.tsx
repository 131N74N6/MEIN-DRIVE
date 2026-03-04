import { Folder, LucideCheckSquare2, Pen, Trash, X } from "lucide-react";
import type { FolderItemIntrf, FolderItemPrevIntrf } from "../models/folderModel";
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
    }, [props.is_selected]);
    
    function updateFolderName(event: React.FormEvent) {
        event.preventDefault();
        props.changeOne.mutate({ _id: props._id, folder_name: folderName.trim() });
    }

    const cancel = () => props.selectOne(props._id);
    
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
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <LucideCheckSquare2/>
                    </button>
                    <button 
                        type="button" 
                        onClick={cancel}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
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
                <Link to={`/folder-files/${props._id}`}>
                    <p className="line-clamp-1">{props.folder_name}</p>
                </Link>
                <p>{new Date(props.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-3 items-center">
                <button 
                    type="button" 
                    onClick={() => props.deleteOne.mutate(props._id)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <Trash
                /></button>
                <button 
                    type="button" 
                    onClick={() => props.selectOne(props._id)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <Pen/>
                </button>
            </div>
        </div>
    );
}

export function FolderItemPreview(props: FolderItemPrevIntrf) {
    props.set_chosen_folder(props.folder_name);
    
    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center cursor-pointer" onClick={() => props.move.mutate(props._id)}>
            <div className="flex gap-2 items-center">
                <Folder/>
                <div className="line-clamp-1">{props.folder_name}</div>
            </div>
        </div>
    );
}