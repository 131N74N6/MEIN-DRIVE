import type { FileListProps } from "../client_models/file.client_model";
import FileItem from "./FileItem";
import Loading from "./Loading";

export default function FileList(props: FileListProps) {
    return (
        <div className="flex flex-col gap-4 px-4 overflow-y-auto">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {props.files.map((file) => (
                    <FileItem 
                        add_to_favorite={props.add_to_favorite}
                        file={file} 
                        get_data={props.get_data}
                        is_in_folder={!!file.folder_id} 
                        is_processing={props.is_processing}
                        key={`file_${file._id}`} 
                        move_outside_folder={props.move_outside_folder}
                        on_delete={props.on_delete}
                        remove_from_favorite={props.remove_from_favorite}
                        showFolderList={props.showFolderList}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ? (
                    <Loading/>
                ) : props.files.length < 14 ? (
                    <></>
                ) : props.isReachedEnd ? (
                    <p className="text-gray-700 font-[500] text-center text-4">No More Files to Show</p>
                ) : (
                    <button 
                        type="button" onClick={() => props.fetchNextPage()} 
                        className="bg-blue-600 cursor-pointer w-[90px] text-white font-[500] p-[0.4rem] text-[0.9rem]"
                    >
                        <span>Show More</span>
                    </button>
                )}
            </div>
        </div>
    );
}