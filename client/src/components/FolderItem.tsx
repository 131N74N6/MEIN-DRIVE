import { Folder, Pen, Trash } from "lucide-react";
import type { FolderIntrf, FolderItemPrevIntrf } from "../models/folderModel";
import { Link } from "react-router-dom";

export function FolderItem(props: FolderIntrf) {
    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center">
            <div className="flex gap-2 items-center">
                <Folder/>
                <Link to={`/folder-files/${props._id}`}>
                    <p className="line-clamp-1">{props.folder_name}</p>
                </Link>
            </div>
            <div className="flex gap-3 items-center">
                <button 
                    type="button" 
                    className="cursor-pointer"
                >
                    <Trash
                /></button>
                <button 
                    type="button" 
                    className="cursor-pointer"
                >
                    <Pen/>
                </button>
            </div>
        </div>
    );
}

export function FolderItemPreview(props: FolderItemPrevIntrf) {
    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center cursor-pointer" onClick={() => props.move.mutate(props._id)}>
            <div className="flex gap-2 items-center">
                <Folder/>
                <div className="line-clamp-1">{props.folder_name}</div>
            </div>
        </div>
    );
}