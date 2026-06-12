import { Navbar1, Navbar2 } from "../components/Navbar";
import FileList from "../components/FileList";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import { Trash } from "lucide-react";
import FolderListPreview from "../components/FolderListPreview";
import FileServices from "../services/file.service";
import { useEffect } from "react";

export default function Home() {
    const { 
        addToFavoriteMt, allFiles, closeFolderList, deleteAllFilesMt, deleteOneFileMt, foldersPreviewData, 
        getData, insertFileToFolderMt, isProcessing, message, moveOutsideFolderMt, openFolderList, 
        removeFromFavoritedMt, searchValue, setChosenFolder, setMessage, setSearchValue, showFolderList 
    } = FileServices();
        
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            {message ? Notification(message) : null}
            {openFolderList ? (
                <FolderListPreview 
                    error={foldersPreviewData.folderError}
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    move={insertFileToFolderMt}
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
                        disabled={isProcessing}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded" 
                        onClick={() => deleteAllFilesMt.mutate()}
                    >
                        <Trash size={22}></Trash>
                    </button>
                </form>
                {allFiles.fileLoad ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allFiles.fileData ? (
                    <FileList 
                        add_to_favorite={addToFavoriteMt}
                        fetchNextPage={allFiles.fileNext} 
                        files={allFiles.fileData} 
                        get_data={getData}
                        isFetchingNextPage={allFiles.fileHasNext}
                        is_processing={isProcessing}
                        isReachedEnd={allFiles.fileEnd} 
                        move_outside_folder={moveOutsideFolderMt}
                        on_delete={deleteOneFileMt}
                        remove_from_favorite={removeFromFavoritedMt}
                        showFolderList={showFolderList}
                    />
                ) : allFiles.fileError ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{allFiles.fileError.message}</span>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">Failed to get posts</span>
                    </div>
                )}
            </div>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}