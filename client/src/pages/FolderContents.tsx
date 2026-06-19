import { Navbar1, Navbar2 } from "../components/Navbar";
import FileList from "../components/FileList";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import { FolderPlusIcon, Trash } from "lucide-react";
import FolderListPreview from "../components/FolderListPreview";
import { useParams } from "react-router-dom";
import FileServices from "../services/file.service";
import { useEffect } from "react";
import FolderServices from "../services/folder.service";
import ChildFolderForm from "../components/ChildFolderForm";
import FolderList from "../components/FolderList";

export default function FolderContents() {
    const { folder_id } = useParams();

    const { 
        addToFavoriteMt: addFileToFavorite, 
        closeFolderList: closeFolderList1, 
        deleteAllFilesInFolderMt, 
        deleteOneFileMt, 
        filesInFolderData, 
        foldersPreviewData, 
        getData, 
        insertFileToFolderMt, 
        isFileProcessing, 
        message, 
        moveOutsideFolderMt, 
        openFolderList: openFolderList1, 
        removeFromFavoritedMt: removeFileFromFavoriteMt, 
        setChosenFolder, 
        setMessage, 
        showFolderList: showFolderList1 
    } = FileServices({ folder_id: folder_id });

    const { 
        addToFavoriteMt: addFolderToFavorite, 
        changeFolderName, 
        childFoldersData, 
        closeFolderList: closeFolderList2, 
        folderName, 
        folderFormToggle, 
        isFolderProcessing,
        makeChildFolderMt, 
        moveChildFolderToInsideMt,
        moveChildFolderToOutsideMt, 
        openForm, 
        openFolderList: openFolderList2,
        removeAllChildFolderMt, 
        removeOneFolderMt, 
        removeFromFavoritedMt: removeFolderFromFavoriteMt,
        selectFolder, 
        selectedFolderId, 
        setSelectedParentFolderId,
        setFolderName, 
        showFolderList: showFolderList2
    } = FolderServices({ parent_folder_id: folder_id! });
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            {message ? Notification(message) : null}
            {openFolderList1 ? (
                <FolderListPreview 
                    for="files"
                    error={foldersPreviewData.folderError}
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={message!}
                    move={insertFileToFolderMt}
                    toggle={closeFolderList1}
                    set_chosen_folder={setChosenFolder}
                /> 
            ) : null}
            {openFolderList2 ? (
                <FolderListPreview 
                    chosen_folder_id={selectedFolderId}
                    error={foldersPreviewData.folderError}
                    for="folders"
                    fetchNextPage={foldersPreviewData.folderNext} 
                    folder_prev={foldersPreviewData.folderData} 
                    isLoading={foldersPreviewData.folderLoad}
                    isFetchingNextPage={foldersPreviewData.folderHasNext} 
                    isReachedEnd={foldersPreviewData.folderEnd}
                    message={message!}
                    move={moveChildFolderToInsideMt}
                    toggle={closeFolderList2}
                    set_chosen_folder={setSelectedParentFolderId}
                /> 
            ) : null}
            {openForm ? (
                <ChildFolderForm 
                    closed_form={folderFormToggle} 
                    message={message} 
                    folder_name={folderName} 
                    is_making={isFileProcessing || isFolderProcessing} 
                    set_folder_name={setFolderName} 
                    submit_folder={makeChildFolderMt}
                    parent_folder_id={folder_id!}
                /> 
            ): null}
            <div className="flex flex-col md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <div className="flex gap-4 items-center pt-4 px-4">
                    <button 
                        type="button" 
                        disabled={isFileProcessing || isFolderProcessing || childFoldersData.isChildFolderLoading || filesInFolderData.fileLoad2}
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
                        disabled={isFileProcessing || isFolderProcessing || childFoldersData.isChildFolderLoading || filesInFolderData.fileLoad2}
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
                {childFoldersData.isChildFolderLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : childFoldersData.childFolderPaginatedData ? (
                    <FolderList 
                        add_to_favorite={addFolderToFavorite}
                        fetchNextPage={childFoldersData.fetchChildFolder} 
                        folders={childFoldersData.childFolderPaginatedData} 
                        get_data={getData}
                        isFetchingNextPage={childFoldersData.isChildFolderFetchingNextPage}
                        is_processing={isFileProcessing || isFolderProcessing}
                        isReachedEnd={childFoldersData.isChildFolderReachedEnd} 
                        move_outside_parent_folder={moveChildFolderToOutsideMt}
                        on_delete={removeOneFolderMt}
                        on_edit={changeFolderName}
                        on_select={selectFolder}
                        remove_from_favorite={removeFolderFromFavoriteMt}
                        selected_folder_id={selectedFolderId}
                        show_folder_list={showFolderList2}
                    />
                ) : childFoldersData.childFolderError ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <div className="text-[2rem] font-[600] text-gray-700">
                            {childFoldersData.childFolderError.message}
                        </div>
                    </div>
                ) : null}
                {filesInFolderData.fileLoad2 ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : filesInFolderData.fileData2 ? (
                    <FileList 
                        add_to_favorite={addFileToFavorite}
                        fetchNextPage={filesInFolderData.fileNext2} 
                        files={filesInFolderData.fileData2} 
                        get_data={getData}
                        isFetchingNextPage={filesInFolderData.fileHasNext2}
                        is_processing={isFileProcessing || isFolderProcessing}
                        isReachedEnd={filesInFolderData.fileEnd2} 
                        move_outside_folder={moveOutsideFolderMt}
                        on_delete={deleteOneFileMt}
                        remove_from_favorite={removeFileFromFavoriteMt}
                        showFolderList={showFolderList1}
                    />
                ) : filesInFolderData.fileError2 ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <div className="text-[2rem] font-[600] text-gray-700">
                            {filesInFolderData.fileError2.message}
                        </div>
                    </div>
                ) : null}
            </div>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}