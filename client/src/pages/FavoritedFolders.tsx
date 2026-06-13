import { FolderPlus, Trash } from "lucide-react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import FolderList from "../components/FolderList";
import FolderForm from "../components/FolderForm";
import FolderServices from "../services/folder.service";
import { useEffect } from "react";
import Notification from "../components/Notification";

export default function FavoritedFolders() {
    const { 
        addToFavoriteMt, changeFolderName,favoritedFoldersData, folderFormToggle, folderName, getData, 
        isProcessing, makeFolder, message, openForm, removeAllFolderMt, removeFromFavoritedMt, removeOneFolderMt, 
        selectFolder, selectedFolderId, setFolderName, setMessage 
    } = FolderServices();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);
    
    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            {message ? Notification(message) : null}
            {openForm ? <FolderForm closed_form={folderFormToggle} message={message} folder_name={folderName} is_making={isProcessing} set_folder_name={setFolderName} submit_folder={makeFolder}/> : null}
            <div className="w-full md:w-3/4 flex flex-col gap-x-4 h-full min-h-[200px] rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-[1rem] items-center pt-[1rem] px-[1rem]">
                    <input
                        type="text"
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search folder here"
                    />
                    <button 
                        type="button"
                        disabled={isProcessing}
                        onClick={() => removeAllFolderMt.mutate()}
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash size={22}/>
                    </button>
                    <button 
                        type="button"
                        disabled={isProcessing}
                        onClick={folderFormToggle}
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FolderPlus size={22}/>
                    </button>
                </form>
                {favoritedFoldersData.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : favoritedFoldersData.paginatedData ? (
                    <FolderList 
                        add_to_favorite={addToFavoriteMt}
                        fetchNextPage={favoritedFoldersData.fetchNextPage} 
                        folders={favoritedFoldersData.paginatedData} 
                        get_data={getData}
                        isFetchingNextPage={favoritedFoldersData.isFetchingNextPage}
                        is_processing={isProcessing}
                        isReachedEnd={favoritedFoldersData.isReachedEnd} 
                        on_delete={removeOneFolderMt}
                        on_edit={changeFolderName}
                        on_select={selectFolder}
                        remove_from_favorite={removeFromFavoritedMt}
                        selected_folder_id={selectedFolderId}
                    />
                ) : favoritedFoldersData.error ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{favoritedFoldersData.error.message}</span>
                    </div>
                ) : (
                    <section className="flex h-full items-center justify-center">
                        <span className="text-gray-700 font-[600] text-4">No favorited folder found...</span>
                    </section>
                )}
            </div>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}