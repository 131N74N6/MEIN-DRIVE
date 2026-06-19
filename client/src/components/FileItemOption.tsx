import { FolderUp, MoveLeft, Star, Trash, X } from "lucide-react";
import type { FileOptionIntrf } from "../client_models/file.client_model";

export default function FileItemOption(props: FileOptionIntrf) {
    return (
        <div className={`p-1.5 flex gap-2.5 flex-col ${props.is_option_show ? 'opacity-100' : 'popacity-0'} transition-opacity`}>
            <div className="text-base">{new Date(props.file.created_at).toLocaleString()}</div>
            <div className="line-clamp-1 text-base">{props.file.file_name}</div>
            <button
                type="button" 
                disabled={props.is_processing}
                onClick={props.show_more_options} 
                className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">
                    <X></X>
                    <div className="font-medium">Cancel</div>
                </div>
            </button>
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={props.handle_favorite}
                className={`cursor-pointer transition-colors font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${props.is_favorited ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <div className="flex gap-4">
                    <Star></Star>
                    <div className="font-medium">{props.is_favorited ? 'Remove from Favorite' : 'Add to Favorite'}</div>
                </div>
            </button>
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={() => props.on_delete.mutate(props.file._id)} 
                className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">
                    <Trash></Trash>
                    <div className="font-medium">Delete this File</div>
                </div>
            </button>
            <button 
                type="button" 
                disabled={props.is_processing}
                onClick={() => props.show_folder_list(props.file._id)} 
                className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex gap-4">
                    <FolderUp></FolderUp>
                    <div className="font-medium">Move to Folder</div>
                </div>
            </button>
            {props.is_in_folder ? (
                <button 
                    type="button" 
                    disabled={props.is_processing}
                    onClick={() => props.move_outside_folder.mutate(props.file._id)} 
                    className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex gap-4">
                        <MoveLeft/>
                        <div className="font-medium">Move Outside Folder</div>
                    </div>
                </button>
            ) : null}
        </div>
    );
}