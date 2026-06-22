import type { HybridListIntrf } from "../models/hybrid.model";
import HybridDataItem from "./HybridDataItem";
import Loading from "./Loading";

export default function HybridDataList(props: HybridListIntrf) {
    return (
        props.filesAndFolders.length === 0 ? (
            <div className="flex justify-center items-center h-full">
                <div className="font-bold text-4xl text-gray-600">No Data Added...</div>
            </div>
        ) : (
            <div className="flex flex-col gap-4 px-4 pb-4 overflow-y-auto">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {props.filesAndFolders.map((fileAndFolder) => (
                        <HybridDataItem 
                            key={`${fileAndFolder._id}`} 
                            addToFavoriteMt={props.addToFavoriteMt}
                            fileAndFolder={fileAndFolder} 
                            getData={props.getData}
                            isFileInFolder={!!fileAndFolder.folder_id} 
                            isProcessing={props.isProcessing}
                            isFolderSelected={props.selectedFolderId === fileAndFolder._id}
                            moveFileOutsideFolder={props.moveFileOutsideFolder!}
                            moveChildFolderOutsideParentFolder={props.moveChildFolderOutsideParentFolder}
                            onDeleteFile={props.onDeleteFile!}
                            onDeleteFolder={props.onDeleteFolder!}
                            onEditFolder={props.onEditFolder!}
                            onSelectFolder={props.onSelectFolder!}
                            removeFromFavoritedMt={props.removeFromFavoritedMt}
                            showFolderListForFile={props.showFolderListForFile!}
                            showFolderListForFolder={props.showFolderListForFolder!}
                        />
                    ))}
                </div>
                <div className="flex justify-center">
                    {props.isFetchingNextPage ? (
                        <Loading/>
                    ) : props.filesAndFolders.length < 14 ? (
                        <></>
                    ) : props.isReachedEnd ? (
                        <p className="text-gray-700 font-[500] text-center text-4">No More Data to Show</p>
                    ) : (
                        <button 
                            type="button" 
                            onClick={() => props.fetchNextPage()} 
                            disabled={props.isProcessing}
                            className="bg-blue-600 rounded-[0.45rem] cursor-pointer w-[90px] text-white font-[500] p-[0.4rem] text-[0.9rem] disabled:currsor-not-allowed"
                        >
                            <span>Show More</span>
                        </button>
                    )}
                </div>
            </div>
        )
    );
}