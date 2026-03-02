import type { FileListProps } from "../models/fileModel";
import FileItem from "./FileItem";
import Loading from "./Loading";

export default function FileList(props: FileListProps) {
    if (props.files.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-gray-700 font-[600] text-[1rem]">No files found...</span>
            </section>
        );
    }

    return (
        <div className="flex flex-col gap-[1rem] px-4 pt-4 overflow-y-auto">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[1rem]">
                {props.files.map((file) => (
                    <FileItem file={file} key={`file_${file._id}`}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ?  <Loading/> : null}
                {props.files.length < 14 ? (
                    <></>
                ) : props.isReachedEnd ? (
                    <p className="text-gray-700 font-[500] text-center text-[1rem]">No More Files to Show</p>
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