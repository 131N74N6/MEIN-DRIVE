import { useEffect, useState } from "react";
import HybridServices from "../services/hybrid.service";
import FileServices from "../services/file.service";
import FolderServices from "../services/folder.service";
import Notification from "../components/Notification";
import FolderListPreview from "../components/FolderListPreview";
import Loading from "../components/Loading";
import HybridDataList from "../components/HybridDataList";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function Favorited() {
    const [messageText, setMessageText] = useState<string | null>(null);
        
    useEffect(() => {
        if (messageText) {
            const timer = setTimeout(() => setMessageText(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [messageText, setMessageText]);
    
    const { 
        addToFavoriteMt, 
        favoritedFilesAndFolders, 
        getData,
        isHybridProcessing, 
        removeFromFavoritedMt, 
        searchValue, 
        setSearchValue
    } = HybridServices({ setMessage: setMessageText });

    const { 
        addFileToFolderMt,
        closeFolderList, 
        deleteOneFileMt, 
        foldersPreviewData, 
        isFileProcessing, 
        openFolderList: openFolderListForFile,
        moveOutsideFolderMt, 
        setChosenFolder,
        showFolderList: showFolderListForFile 
    } = FileServices({ setMessage: setMessageText });
    
    const { 
        changeFolderName, 
        isFolderProcessing, 
        moveChildFolderToInsideMt,
        moveChildFolderToOutsideMt,
        openFolderList: openFolderListForFolder,
        removeOneFolderMt, 
        selectFolder, 
        selectedFolderId,
        setSelectedParentFolderId,
        showFolderList: showFolderListForFolder 
    } = FolderServices({ setMessage: setMessageText });

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            {messageText ? Notification(messageText) : null}
            {openFolderListForFile ? (
                <FolderListPreview 
                    error={foldersPreviewData.folderError}
                    for="files"
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={messageText!}
                    move={addFileToFolderMt}
                    toggle={closeFolderList}
                    set_chosen_folder={setChosenFolder}
                /> 
            ) : null}
            {openFolderListForFolder ? (
                <FolderListPreview 
                    error={foldersPreviewData.folderError}
                    for="folders"
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={messageText!}
                    move={moveChildFolderToInsideMt}
                    toggle={closeFolderList}
                    set_chosen_folder={setSelectedParentFolderId}
                /> 
            ) : null}
            <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-4 items-center pt-4 px-4">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                </form>
                {favoritedFilesAndFolders.fileLoad3 ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : favoritedFilesAndFolders.fileError3 ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{favoritedFilesAndFolders.fileError3.message}</span>
                    </div>
                ) : (
                    <HybridDataList
                        addToFavoriteMt={addToFavoriteMt}
                        filesAndFolders={favoritedFilesAndFolders.fileData3}
                        fetchNextPage={favoritedFilesAndFolders.fileNext3}
                        getData={getData}
                        isFetchingNextPage={favoritedFilesAndFolders.fileHasNext3}
                        isReachedEnd={favoritedFilesAndFolders.fileEnd3}
                        isProcessing={isHybridProcessing || isFileProcessing || isFolderProcessing}
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
            {Navbar1(isFileProcessing || isFolderProcessing || favoritedFilesAndFolders.fileLoad3 || isHybridProcessing)}
            {Navbar2(isFileProcessing || isFolderProcessing || favoritedFilesAndFolders.fileLoad3 || isHybridProcessing)}
        </section>
    );
}