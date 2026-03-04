import { Trash } from "lucide-react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import DataModifier from "../services/dataService";
import { useParams } from "react-router-dom";
import FileListInFolder from "../components/FileListInFolder";
import type { FolderDetailIntrf } from "../models/folderModel";

export default function Files() {
    const { file_id } = useParams();

    const { infiniteScroll } = DataModifier();
    const { fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd, error, paginatedData } = infiniteScroll<FolderDetailIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folder/get/${file_id}`,
        limit: 14,
        query_key: [`file-in-folder-${file_id}`],
        stale_time: 1200000
    });

    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            <div className="w-full md:w-3/4 flex flex-col gap-x-4 h-full min-h-[200px] rounded shadow-[0_0_4px_#1a1a1a] bg-white">
                <form className="flex gap-[1rem] items-center pt-[1rem] px-[1rem]">
                    <input
                        type="text"
                        className="border rounded border-gray-700 p-[0.45rem] w-full text-[0.9rem] outline-0 font-[500]"
                        placeholder="search folder here"
                    />
                    <button 
                        type="button"
                        className="cursor-pointer flex justify-center w-[90px] bg-gray-700 text-white text-[0.9rem] p-[0.4rem] rounded"
                    >
                        <Trash size={22}/>
                    </button>
                </form>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : paginatedData ? (
                    <FileListInFolder 
                        fetchNextPage={fetchNextPage} 
                        file_list={paginatedData} 
                        isFetchingNextPage={isFetchingNextPage}
                        isReachedEnd={isReachedEnd} 
                    />
                ) : error ? (
                    <div className="flex justify-center items-center h-full bg-white">
                        <span className="text-[2rem] font-[600] text-gray-700">{error.message}</span>
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