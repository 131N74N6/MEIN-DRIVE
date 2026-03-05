import type { FileListProps } from "../models/fileModel";
import FileItem from "./FileItem";
import Loading from "./Loading";

export default function FileList(props: FileListProps) {
    if (props.files.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-gray-700 font-[600] text-4">No files found...</span>
            </section>
        );
    }

    return (
        <div className="flex flex-col gap-4 px-4 overflow-y-auto">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
                {props.files.map((file) => (
                    <FileItem 
                        file={file} 
                        is_in_folder={!!file.folder_name} 
                        key={`file_${file._id}`} 
                        move_outside_folder={props.move_outside_folder}
                        showFolderList={props.showFolderList}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ?  <Loading/> : null}
                {props.files.length < 14 ? (
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