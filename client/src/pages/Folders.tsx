import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import { FolderPlus, Trash } from "lucide-react";
import FolderListPreview from "../components/FolderListPreview";
import { useEffect, useState } from "react";
import HybridServices from "../services/hybrid.service";
import FileServices from "../services/file.service";
import HybridDataList from "../components/HybridDataList";
import FolderServices from "../services/folder.service";
import FolderForm from "../components/FolderForm";

export default function Folders() {
    const [messageText, setMessageText] = useState<string | null>(null);
        
    useEffect(() => {
        if (messageText) {
            const timer = setTimeout(() => setMessageText(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [messageText, setMessageText]);

    const { 
        addToFavoriteMt, 
        getData,
        isHybridProcessing, 
        removeFromFavoritedMt
    } = HybridServices({ setMessage: setMessageText });

    const { 
        foldersPreviewData, 
        isFileProcessing
    } = FileServices({ setMessage: setMessageText });
    
    const { 
        changeFolderName, 
        closeFolderList,
        foldersData,
        folderFormToggle,
        folderName,
        isFolderProcessing, 
        makeFolder,
        moveChildFolderToInsideMt,
        moveChildFolderToOutsideMt,
        openFolderList: openFolderListForFolder,
        openForm,
        removeAllFolderMt,
        removeOneFolderMt, 
        searchValue,
        selectFolder, 
        setFolderName,
        setSelectedParentFolderId,
        setSearchValue,
        selectedFolderId,
        showFolderList: showFolderListForFolder,
    } = FolderServices({ setMessage: setMessageText });

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            {messageText ? Notification(messageText) : null}
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
            {openForm ? (
                <FolderForm 
                    closed_form={folderFormToggle} 
                    message={messageText} 
                    folder_name={folderName} 
                    is_making={isFolderProcessing || isHybridProcessing} 
                    set_folder_name={setFolderName} 
                    submit_folder={makeFolder}
                /> 
            ): null}
            <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-4 items-center pt-4 px-4">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search file here"
                    />
                    <button 
                        type="button" 
                        disabled={isFileProcessing || foldersData.isLoading}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" 
                        onClick={() => removeAllFolderMt.mutate()}
                    >
                        <Trash size={22}></Trash>
                    </button><button 
                        type="button"
                        disabled={isFolderProcessing || foldersData.isLoading}
                        onClick={folderFormToggle}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded"
                    >
                        <FolderPlus size={22}/>
                    </button>
                </form>
                {foldersData.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : foldersData.error ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{foldersData.error.message}</span>
                    </div>
                ) : (
                    <HybridDataList
                        addToFavoriteMt={addToFavoriteMt}
                        filesAndFolders={foldersData.paginatedData}
                        fetchNextPage={foldersData.fetchNextPage}
                        getData={getData}
                        isFetchingNextPage={foldersData.isFetchingNextPage}
                        isReachedEnd={foldersData.isReachedEnd}
                        isProcessing={isFolderProcessing || foldersData.isLoading || isHybridProcessing || isFileProcessing}
                        moveChildFolderOutsideParentFolder={moveChildFolderToOutsideMt}
                        onDeleteFolder={removeOneFolderMt}
                        onEditFolder={changeFolderName}
                        onSelectFolder={selectFolder}
                        removeFromFavoritedMt={removeFromFavoritedMt}
                        selectedFolderId={selectedFolderId}
                        showFolderListForFolder={showFolderListForFolder}
                    />
                )}
            </div>
            {Navbar1(isFolderProcessing || foldersData.isLoading || isHybridProcessing || isFileProcessing)}
            {Navbar2(isFolderProcessing || foldersData.isLoading || isHybridProcessing || isFileProcessing)}
        </section>
    );
}