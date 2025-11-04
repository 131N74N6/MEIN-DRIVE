import { useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import AddFiles from "../components/AddFiles";
import DataModifier from "../services/data-modifier";
import useAuth from "../services/useAuth";
import type { FilesDataProps } from "../services/custom-types";

export default function Home() {
    const { currentUserId } = useAuth();
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
        api_url: `http://localhost:1234/files/get-all/${currentUserId}`,
        limit: 14,
        query_key: [`all-files-${currentUserId}`],
        stale_time: 600000
    });

    return (
        <div className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-purple-950">
            {openUploader ? <AddFiles setOpenUploader={setOpenUploader}/> : null}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[1rem] p-[1rem] border border-purple-400 rounded">
                <button onClick={() => setOpenUploader(true)}></button>
            </div>
            <Navbar2/>
            <Navbar1/>
        </div>
    );
}