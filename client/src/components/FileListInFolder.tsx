import type { FileListInFolderIntrf } from "../models/fileModel";
import FileItemInFolder from "./FileItemInFolder";
import Loading from "./Loading";

export default function FileListInFolder(props: FileListInFolderIntrf) {
    if (props.file_list.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-gray-700 font-[600] text-4">No files found...</span>
            </section>
        );
    }

    return (
        <div className="flex flex-col gap-[1rem] px-4 pt-4 overflow-y-auto">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {props.file_list.map((file, index) => (
                    <FileItemInFolder key={`fl2-${index}`} {...file}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ?  <Loading/> : null}
                {props.file_list.length < 14 ? (
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
    )
}