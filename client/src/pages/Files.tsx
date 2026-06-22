import { useEffect, useState } from "react";
import HybridServices from "../services/hybrid.service";
import FileServices from "../services/file.service";
import Notification from "../components/Notification";
import FolderListPreview from "../components/FolderListPreview";
import { Trash } from "lucide-react";
import Loading from "../components/Loading";
import HybridDataList from "../components/HybridDataList";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function Files() {
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
        removeFromFavoritedMt, 
    } = HybridServices({ setMessage: setMessageText });

    const { 
        addFileToFolderMt,
        allFilesOnly,
        closeFolderList, 
        deleteAllFilesMt, 
        deleteOneFileMt, 
        foldersPreviewData, 
        isFileProcessing, 
        openFolderList: openFolderListForFile,
        moveOutsideFolderMt, 
        searchValue,
        setChosenFolder,
        setSearchValue,
        showFolderList: showFolderListForFile 
    } = FileServices({ setMessage: setMessageText });

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
                        disabled={isFileProcessing || allFilesOnly.fileLoad}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" 
                        onClick={() => deleteAllFilesMt.mutate()}
                    >
                        <Trash size={22}></Trash>
                    </button>
                </form>
                {allFilesOnly.fileLoad ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allFilesOnly.fileError ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{allFilesOnly.fileError.message}</span>
                    </div>
                ) : (
                    <HybridDataList
                        addToFavoriteMt={addToFavoriteMt}
                        filesAndFolders={allFilesOnly.fileData}
                        fetchNextPage={allFilesOnly.fileNext}
                        getData={getData}
                        isFetchingNextPage={allFilesOnly.fileHasNext}
                        isReachedEnd={allFilesOnly.fileEnd}
                        isProcessing={isHybridProcessing || isFileProcessing || isHybridProcessing || allFilesOnly.fileLoad}
                        moveFileOutsideFolder={moveOutsideFolderMt}
                        onDeleteFile={deleteOneFileMt}
                        removeFromFavoritedMt={removeFromFavoritedMt}
                        showFolderListForFile={showFolderListForFile}
                    />
                )}
            </div>
            {Navbar1(isFileProcessing || isHybridProcessing || allFilesOnly.fileLoad)}
            {Navbar2(isFileProcessing || isHybridProcessing || allFilesOnly.fileLoad)}
        </section>
    );
}