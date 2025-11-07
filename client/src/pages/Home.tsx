import { useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import AddFiles from "../components/AddFiles";
import DataModifier from "../services/data-modifier";
import useAuth from "../services/useAuth";
import type { FilesDataProps } from "../services/custom-types";
import FileList from "../components/FileList";
import Loading from "../components/Loading";

export default function Home() {
    const { currentUserId, token } = useAuth();
    const { infiniteScroll } = DataModifier();
    const [openUploader, setOpenUploader] = useState<boolean>(false);
    
    const { 
        error,
        fetchNextPage, 
        isFetchingNextPage, 
        isLoading,
        isReachedEnd, 
        paginatedData 
    } = infiniteScroll<FilesDataProps>({
        api_url: currentUserId ? `http://localhost:1234/files/get-all/${currentUserId}` : '',
        limit: 14,
        query_key: [`all-files-${currentUserId}`],
        stale_time: 600000,
        token: token
    });

    return (
        <div className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            {openUploader ? <AddFiles setOpenUploader={setOpenUploader}/> : null}
            <div className="flex flex-col p-[1rem] gap-[1rem] md:w-3/4 h-[100%] min-h-[200px] w-full shadow-[0_0_4px_#1a1a1a] rounded bg-white">
                <button onClick={() => setOpenUploader(true)}>Add Files +</button>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : paginatedData ? (
                    <FileList 
                        fetchNextPage={fetchNextPage} 
                        files={paginatedData} 
                        isFetchingNextPage={isFetchingNextPage}
                        isReachedEnd={isReachedEnd} 
                    />
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="text-[2rem] font-[600] text-purple-700">{error.message}</span>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full bg-[#1a1a1a]">
                        <span className="text-[2rem] font-[600] text-purple-700">Failed to get posts</span>
                    </div>
                )}
            </div>
            <Navbar2/>
            <Navbar1/>
        </div>
    );
}