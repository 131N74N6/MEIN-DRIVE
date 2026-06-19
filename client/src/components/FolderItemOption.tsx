import { FolderUp, MoveLeft, Pen, Star, Trash, X } from "lucide-react";
import type { FolderOptionIntrf } from "../client_models/folder.client_model";

export default function FolderItemOption(props: FolderOptionIntrf) {
    return (
        <div className="flex flex-col p-1.5 gap-2.5">
            <div className="font-medium text-gray-500">{props.folder.created_at}</div>
            <button
                type="button" 
                disabled={props.is_processing}
                onClick={props.show_more_options} 
                className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">
                    <X></X>
                    <div className="font-medium">Cancel</div>
                </div>
            </button>
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={() => props.on_delete.mutate(props.folder._id)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">
                    <Trash/>
                    <div className="font-medium">Delete this Folder</div>
                </div>
            </button>
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={() => props.on_select(props.folder._id)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">                       
                    <Pen/>
                    <div className="font-medium">Change Folder Name</div>
                </div>
            </button>
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={props.handle_favorite}
                className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${props.is_favorited ? 'text-blue-600' : 'text-gray-500'}`}
            >
                <div className="flex gap-4">                       
                    <Star/>
                    <div className="font-medium">{props.is_favorited ? 'Remove from Favorite' : 'Add to Favorite'}</div>
                </div>
            </button>
            {props.folder.parent_folder_id !== undefined ? (
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={() => props.move_outside_parent_folder?.mutate(props.folder._id)}
                    className="cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
                >
                    <div className="flex gap-4">                       
                        <MoveLeft/>
                        <div className="font-medium">Move Outside Folder</div>
                    </div>
                </button>
            ) : null}
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={() => props.show_folder_list(props.folder._id)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">
                    <FolderUp/>
                    <div className="font-medium">Move To Folder</div>
                </div>
            </button>
        </div>
    );
}