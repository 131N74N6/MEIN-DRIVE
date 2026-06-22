import type { HybridItemIntrf } from "../models/hybrid.model";
import { EllipsisVertical, Folder, LucideCheckSquare2, X } from "lucide-react";
import FileIcon from "./HybridDataIcon";
import { useEffect, useState } from "react";
import FileItemOption from "./HybridDataOption";
import useShowOption from "../hooks/useShowOption";

export default function HybridDataItem(props: HybridItemIntrf) {
    const [folderName, setFolderName] = useState<string>('');
    const { showOption, handleShowOption } = useShowOption();

    useEffect(() => {
        if (props.isFolderSelected) {
            setFolderName(props.fileAndFolder.folder_name!);
        } else {
            setFolderName('');
        }
    }, [props.isFolderSelected, props.fileAndFolder.parent_folder_id, props.fileAndFolder.folder_name, props.fileAndFolder._id]);

    const { data: isFavorited } = props.getData<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/hybrids/is-favorited/${props.fileAndFolder._id}`,
        query_key: [`is-favorited-${props.fileAndFolder._id}`],
        stale_time: Infinity
    });

    function handleFavorite() {
        if (isFavorited) props.removeFromFavoritedMt.mutate(props.fileAndFolder._id);
        else props.addToFavoriteMt.mutate(props.fileAndFolder._id);
    }

    function updateFolderName(event: React.FormEvent) {
        event.preventDefault();
        props.onEditFolder.mutate({ _id: props.fileAndFolder._id, folder_name: folderName.trim() });
    }
    
    const cancel = () => props.onSelectFolder(props.fileAndFolder._id);

    if (props.isFolderSelected) {
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
                        disabled={props.isProcessing}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex gap-4">
                            <LucideCheckSquare2/>
                            <div className="font-medium">Save Change</div>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isProcessing}
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
                <FileItemOption
                    fileAndFolder={props.fileAndFolder}
                    handleFavorite={handleFavorite}
                    isFavorited={isFavorited!}
                    isFileInFolder={props.isFileInFolder}
                    isFileOptionShow={showOption}
                    isProcessing={props.isProcessing}
                    moveFileOutsideFolder={props.moveFileOutsideFolder}
                    moveChildFolderOutsideParentFolder={props.moveChildFolderOutsideParentFolder}
                    onDeleteFile={props.onDeleteFile}
                    onDeleteFolder={props.onDeleteFolder}
                    onSelectFolder={props.onSelectFolder}
                    showFolderListForFile={props.showFolderListForFile}
                    showFolderListForFolder={props.showFolderListForFolder}
                    showMoreOption={handleShowOption}
                />
            ) : (
                <>
                    <FileIcon fileAndFolder={props.fileAndFolder}/>
                    <hr className="bg-gray-500"/>
                    <div className="flex gap-2">
                        <button 
                            type="button" 
                            disabled={props.isProcessing}
                            onClick={handleShowOption}
                            className='cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed text-gray-500'
                        >
                            <EllipsisVertical size={16}/>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}