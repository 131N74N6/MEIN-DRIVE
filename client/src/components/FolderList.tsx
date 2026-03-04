import { X } from "lucide-react";
import type { FolderListIntrf, FolderListPrevIntrf } from "../models/folderModel";
import { FolderItem, FolderItemPreview } from "./FolderItem";
import Loading from "./Loading";

export function FolderList(props: FolderListIntrf) {
    if (props.folders.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-gray-700 font-[600] text-[1rem]">No folders found...</span>
            </section>
        );
    }
    
    return (
        <div className="flex flex-col gap-[1rem] px-4 pt-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
                {props.folders.map((folder, index) => (
                    <FolderItem 
                        key={`folder-${index}`} 
                        {...folder} 
                        is_selected={props.selectedFolderId === folder._id}
                        selectedFolderId={props.selectedFolderId}
                        selectOne={props.selectOne} 
                        changeOne={props.changeOne} 
                        deleteOne={props.deleteOne}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ?  <Loading/> : null}
                {props.folders.length < 14 ? (
                    <></>
                ) : props.isReachedEnd ? (
                    <p className="text-gray-700 font-[500] text-center text-[1rem]">No More Files to Show</p>
                ) : (
                    <button 
                        type="button" onClick={() => props.fetchNextPage()} 
                        className="bg-blue-600 cursor-pointer w-[90px] text-white font-[500] p-[0.4rem] text-[0.9rem]"
                    >
                        <span>Show More</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export function FolderListPreview(props: FolderListPrevIntrf) {
    if (props.folder_prev.length === 0) {
        return (
            <section className="flex justify-center items-center fixed inset-0 z-20 border bg-[rgba(0,0,0,0.66)] p-3">
                <div className="bg-white">
                    <span className="text-gray-700 font-[600] text-[1rem]">No folders found...</span>
                </div>
            </section>
        );
    }
    
    return (
        <div className="flex justify-center items-center fixed inset-0 z-20 border bg-[rgba(0,0,0,0.66)] p-3">
            <div className="flex flex-col gap-[1rem] w-170 h-180 px-4 pt-4 overflow-y-auto bg-white">
                <>
                    <button 
                    onClick={props.toggle}
                    type="button" 
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X></X>
                </button>
                </>
                <div className="flex flex-col gap-4">
                    {props.folder_prev.map((folder, index) => (
                        <FolderItemPreview key={`folder-${index}`} move={props.move} _id={folder._id} folder_name={folder.folder_name}/>
                    ))}
                </div>
                <div className="flex justify-center">
                    {props.isFetchingNextPage ?  <Loading/> : null}
                    {props.folder_prev.length < 14 ? (
                        <></>
                    ) : props.isReachedEnd ? (
                        <p className="text-gray-700 font-[500] text-center text-[1rem]">No More Files to Show</p>
                    ) : (
                        <button 
                            type="button" onClick={() => props.fetchNextPage()} 
                            className="bg-blue-600 cursor-pointer w-[90px] text-white font-[500] p-[0.4rem] text-[0.9rem]"
                        >
                            <span>Show More</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}