import { useEffect, useState } from "react";
import HybridServices from "../services/hybrid.service";
import FileServices from "../services/file.service";
import FolderServices from "../services/folder.service";
import Notification from "../components/Notification";
import FolderListPreview from "../components/FolderListPreview";
import Loading from "../components/Loading";
import HybridDataList from "../components/HybridDataList";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { useParams } from "react-router-dom";
import ChildFolderForm from "../components/ChildFolderForm";
import { FolderPlusIcon, Trash } from "lucide-react";

export default function FolderContents() {
    const { folder_id } = useParams();
    const [messageText, setMessageText] = useState<string | null>(null);
        
    useEffect(() => {
        if (messageText) {
            const timer = setTimeout(() => setMessageText(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [messageText, setMessageText]);

    const { 
        addToFavoriteMt, 
        allFilesAndChildFolders, 
        getData,
        isHybridProcessing, 
        removeFromFavoritedMt, 
        searchValue, 
        setSearchValue
    } = HybridServices({ parent_folder_id: folder_id, setMessage: setMessageText });

    const { 
        addFileToFolderMt, 
        closeFolderList: closeFolderList1, 
        deleteAllFilesInFolderMt, 
        deleteOneFileMt, 
        foldersPreviewData, 
        isFileProcessing, 
        moveOutsideFolderMt, 
        openFolderList: openFolderListForFile, 
        setChosenFolder, 
        showFolderList: showFolderListForFile 
    } = FileServices({ folder_id: folder_id, setMessage: setMessageText });

    const { 
        changeFolderName, 
        closeFolderList: closeFolderList2, 
        folderName, 
        folderFormToggle, 
        folderToMove,
        isFolderProcessing,
        makeChildFolderMt, 
        moveChildFolderToInsideMt,
        moveChildFolderToOutsideMt, 
        openForm, 
        openFolderList: openFolderListForFolder,
        removeAllChildFolderMt, 
        removeOneFolderMt, 
        selectFolder, 
        selectedFolderId, 
        setSelectedParentFolderId,
        setFolderName, 
        showFolderList: showFolderListForFolder
    } = FolderServices({ parent_folder_id: folder_id!, setMessage: setMessageText });
    
    useEffect(() => {
        if (messageText) {
            const timer = setTimeout(() => setMessageText(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [messageText, setMessageText]);

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            {messageText ? Notification(messageText) : null}
            {openFolderListForFile ? (
                <FolderListPreview 
                    for="files"
                    error={foldersPreviewData.folderError}
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={messageText!}
                    move={addFileToFolderMt}
                    toggle={closeFolderList1}
                    set_chosen_folder={setChosenFolder}
                /> 
            ) : null}
            {openFolderListForFolder ? (
                <FolderListPreview 
                    chosen_folder_id={folderToMove}
                    error={foldersPreviewData.folderError}
                    for="folders"
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={messageText!}
                    move={moveChildFolderToInsideMt}
                    toggle={closeFolderList2}
                    set_chosen_folder={setSelectedParentFolderId}
                /> 
            ) : null}
            {openForm ? (
                <ChildFolderForm 
                    closed_form={folderFormToggle} 
                    message={messageText} 
                    folder_name={folderName} 
                    is_making={isFileProcessing || isFolderProcessing} 
                    set_folder_name={setFolderName} 
                    submit_folder={makeChildFolderMt}
                    parent_folder_id={folder_id!}
                /> 
            ): null}
            <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <div className="flex gap-4 items-center pt-4 px-4">
                    <button 
                        type="button" 
                        disabled={isFileProcessing || isFolderProcessing || allFilesAndChildFolders.fcfisLoading || isHybridProcessing}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium flex justify-center bg-gray-700 text-white text-[0.9rem] p-2 rounded" 
                        onClick={() => deleteAllFilesInFolderMt.mutate()}
                    >
                        <div className="flex gap-1">
                            <Trash size={22}></Trash>
                            <span>Delete All Files</span>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={isFileProcessing || isFolderProcessing || allFilesAndChildFolders.fcfisLoading || isHybridProcessing}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium flex justify-center bg-gray-700 text-white text-[0.9rem] p-2 rounded" 
                        onClick={() => removeAllChildFolderMt.mutate(folder_id!)}
                    >
                        <div className="flex gap-1">
                            <Trash size={22}></Trash>
                            <span>Delete All Folders</span>
                        </div>
                    </button>
                    <button 
                        type="button" 
                        disabled={isFileProcessing || isFolderProcessing}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium flex justify-center bg-gray-700 text-white text-[0.9rem] p-2 rounded" 
                        onClick={folderFormToggle}
                    >
                        <div className="flex gap-1">
                            <FolderPlusIcon size={22}></FolderPlusIcon>
                            <span>Make New Folder</span>
                        </div>
                    </button>
                </div>
                <form className="flex gap-4 items-center px-4">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                </form>
                {allFilesAndChildFolders.fcfisLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                )  : allFilesAndChildFolders.fcfError ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{allFilesAndChildFolders.fcfError.message}</span>
                    </div>
                ) : (
                    <HybridDataList
                        addToFavoriteMt={addToFavoriteMt}
                        filesAndFolders={allFilesAndChildFolders.fcfData}
                        fetchNextPage={allFilesAndChildFolders.fetchNextFCF}
                        getData={getData}
                        isFetchingNextPage={allFilesAndChildFolders.fcfHasNext}
                        isReachedEnd={allFilesAndChildFolders.fcfReachEnd}
                        isProcessing={isHybridProcessing || isFolderProcessing || isFileProcessing || allFilesAndChildFolders.fcfisLoading}
                        moveFileOutsideFolder={moveOutsideFolderMt}
                        moveChildFolderOutsideParentFolder={moveChildFolderToOutsideMt}
                        onDeleteFile={deleteOneFileMt}
                        onDeleteFolder={removeOneFolderMt}
                        onEditFolder={changeFolderName}
                        onSelectFolder={selectFolder}
                        removeFromFavoritedMt={removeFromFavoritedMt}
                        selectedFolderId={selectedFolderId}
                        showFolderListForFile={showFolderListForFile}
                        showFolderListForFolder={showFolderListForFolder}
                    />
                )}
            </div>
            {Navbar1(isHybridProcessing || isFolderProcessing || isFileProcessing || allFilesAndChildFolders.fcfisLoading)}
            {Navbar2(isHybridProcessing || isFolderProcessing || isFileProcessing || allFilesAndChildFolders.fcfisLoading)}
        </section>
    );
}