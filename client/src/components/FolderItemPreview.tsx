import { Folder } from "lucide-react";
import type { FolderItemPrevIntrf } from "../models/folder_model";

export default function FolderItemPreview(props: FolderItemPrevIntrf) {
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