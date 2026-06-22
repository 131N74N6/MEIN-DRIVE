import { FolderUp, MoveLeft, Pen, Star, Trash, View, X } from "lucide-react";
import type { HybridOptionIntrf } from "../models/hybrid.model";
import { useNavigate } from "react-router-dom";

export default function HybridDataOption(props: HybridOptionIntrf) {
    const navigate = useNavigate();

    return (
        <div className={`p-1.5 flex gap-2.5 flex-col ${props.isFileOptionShow ? 'opacity-100' : 'popacity-0'} transition-opacity`}>
            {props.fileAndFolder.category === "files" ? (
                <>
                    <div className="text-base">{new Date(props.fileAndFolder.created_at).toLocaleString()}</div>
                    <div className="line-clamp-1 text-base">{props.fileAndFolder.file_name}</div>
                    <button
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={props.showMoreOption} 
                        className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <X></X>
                            <div className="font-medium">Cancel</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={props.handleFavorite}
                        className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${props.fileAndFolder.is_favorited ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <div className="flex gap-4">
                            <Star></Star>
                            <div className="font-medium">{props.isFavorited ? 'Remove from Favorite' : 'Add to Favorite'}</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={() => props.onDeleteFile.mutate(props.fileAndFolder._id)} 
                        className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <Trash></Trash>
                            <div className="font-medium">Delete this File</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={() => props.showFolderListForFile(props.fileAndFolder._id)} 
                        className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <FolderUp></FolderUp>
                            <div className="font-medium">Move to Folder</div>
                        </div>
                    </button>                 
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={() => navigate(`/file/${props.fileAndFolder._id}`)}
                        className='cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <div className="flex gap-4">
                            <View/>
                            <div className="font-medium">See</div>
                        </div>
                    </button>
                    {props.isFileInFolder ? (
                        <button 
                            type="button" 
                            disabled={props.isProcessing}
                            onClick={() => props.moveFileOutsideFolder.mutate(props.fileAndFolder._id)} 
                            className="cursor-pointer hover:text-gray-700 transition-colors text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex gap-4">
                                <MoveLeft/>
                                <div className="font-medium">Move Outside Folder</div>
                            </div>
                        </button>
                    ) : null}
                </>
            ) : props.fileAndFolder.category === "folders" ? (
                <>
                    <div className="text-base">{new Date(props.fileAndFolder.created_at).toLocaleString()}</div>
                    <div className="line-clamp-1 text-base">{props.fileAndFolder.folder_name}</div>
                    <button
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={props.showMoreOption} 
                        className="cursor-pointer text-gray-500 font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <X></X>
                            <div className="font-medium">Cancel</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={() => props.onDeleteFolder.mutate(props.fileAndFolder._id)}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <Trash/>
                            <div className="font-medium">Delete this Folder</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={() => props.onSelectFolder(props.fileAndFolder._id!)}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">                       
                            <Pen/>
                            <div className="font-medium">Change Folder Name</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
                        onClick={props.handleFavorite}
                        className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${props.fileAndFolder.is_favorited ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <div className="flex gap-4">                       
                            <Star/>
                            <div className="font-medium">{props.fileAndFolder.is_favorited ? 'Remove from Favorite' : 'Add to Favorite'}</div>
                        </div>
                    </button>
                    {props.fileAndFolder.parent_folder_id !== undefined ? (
                        <button 
                            type="button" 
                            disabled={props.isProcessing}
                            onClick={() => props.moveChildFolderOutsideParentFolder?.mutate(props.fileAndFolder._id)}
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
                        disabled={props.isProcessing}
                        onClick={() => props.showFolderListForFolder(props.fileAndFolder._id)}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <FolderUp/>
                            <div className="font-medium">Move To Folder</div>
                        </div>
                    </button>
                </>
            ) : null}
        </div>
    );
}