import { FolderPlus, Trash } from "lucide-react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import FolderList from "../components/FolderList";
import FolderForm from "../components/FolderForm";
import FolderServices from "../services/folder.service";
import { useEffect } from "react";
import Notification from "../components/Notification";
import FolderListPreview from "../components/FolderListPreview";
import FileServices from "../services/file.service";

export default function Folders() {
    const { 
        foldersPreviewData, 
        message: fileMessage, 
        setMessage: setFileMessage 
    } = FileServices();

    const { 
        addToFavoriteMt, 
        changeFolderName, 
        closeFolderList,
        foldersData, 
        folderName, 
        folderFormToggle, 
        getData, 
        isFolderProcessing, 
        makeFolder, 
        message: folderMessage, 
        moveChildFolderToInsideMt,
        moveChildFolderToOutsideMt,
        openForm, 
        openFolderList,
        removeAllFolderMt, 
        removeFromFavoritedMt, 
        removeOneFolderMt, 
        searchValue, 
        selectFolder, 
        selectedFolderId,
        folderToMove, 
        setFolderName, 
        setMessage: setFolderMessage, 
        setSearchValue, 
        setSelectedParentFolderId,
        showFolderList
    } = FolderServices();
        
    useEffect(() => {
        if (fileMessage) {
            const timer = setTimeout(() => setFileMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [fileMessage, setFileMessage]);
        
    useEffect(() => {
        if (folderMessage) {
            const timer = setTimeout(() => setFolderMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [folderMessage, setFolderMessage]);
    
    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            {fileMessage ? Notification(fileMessage) : null}
            {folderMessage ? Notification(folderMessage) : null}
            {openFolderList ? (
                <FolderListPreview 
                    chosen_folder_id={folderToMove}
                    error={foldersPreviewData.folderError}
                    for="folders"
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={fileMessage!}
                    move={moveChildFolderToInsideMt}
                    toggle={closeFolderList}
                    set_chosen_folder={setSelectedParentFolderId}
                /> 
            ) : null}
            {openForm ? (
                <FolderForm 
                    closed_form={folderFormToggle} 
                    message={folderMessage} 
                    folder_name={folderName} 
                    is_making={isFolderProcessing} 
                    set_folder_name={setFolderName} 
                    submit_folder={makeFolder}
                /> 
            ): null}
            <div className="w-full md:w-3/4 flex flex-col gap-x-4 h-full min-h-[200px] rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-[1rem] items-center pt-[1rem] px-[1rem]">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search folder here"
                    />
                    <button 
                        type="button"
                        disabled={isFolderProcessing || foldersData.isLoading}
                        onClick={() => removeAllFolderMt.mutate()}
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash size={22}/>
                    </button>
                    <button 
                        type="button"
                        disabled={isFolderProcessing || foldersData.isLoading}
                        onClick={folderFormToggle}
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FolderPlus size={22}/>
                    </button>
                </form>
                {foldersData.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : foldersData.paginatedData ? (
                    <FolderList 
                        add_to_favorite={addToFavoriteMt}
                        fetchNextPage={foldersData.fetchNextPage} 
                        folders={foldersData.paginatedData} 
                        get_data={getData}
                        isFetchingNextPage={foldersData.isFetchingNextPage}
                        isReachedEnd={foldersData.isReachedEnd} 
                        move_outside_parent_folder={moveChildFolderToOutsideMt}
                        on_delete={removeOneFolderMt}
                        on_edit={changeFolderName}
                        on_select={selectFolder}
                        remove_from_favorite={removeFromFavoritedMt}
                        is_processing={isFolderProcessing}
                        selected_folder_id={selectedFolderId}
                        show_folder_list={showFolderList}
                    />
                ) : foldersData.error ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{foldersData.error.message}</span>
                    </div>
                ) : (
                    <section className="flex h-full items-center justify-center">
                        <span className="text-gray-700 font-[600] text-4">No Folders found...</span>
                    </section>
                )}
            </div>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}