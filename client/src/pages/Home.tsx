import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/data-modifier";
import useAuth from "../services/useAuth";
import type { FilesDataProps } from "../services/custom-types";
import FileList from "../components/FileList";
import Loading from "../components/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
    const { currentUserId, token } = useAuth();
    const { deleteData, infiniteScroll } = DataModifier();
    const queryClient = useQueryClient();
    
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

    const deleteFileMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteData({
                api_url: `http://localhost:1234/files/erase/${id}`,
                token: token
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] }),
    });

    const deleteAllFilesMutation = useMutation({
        mutationFn: async () => {
            await deleteData({
                api_url: `http://localhost:1234/files/erase-all/${currentUserId}`,
                token: token
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] }),
    });

    const deleteOneFile = (id: string) => {
        deleteFileMutation.mutate(id);
    }

    const deleteAllFiles = () => {
        deleteAllFilesMutation.mutate();
    }

    return (
        <section className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-white z-10 relative">
            <div className="flex flex-col p-[1rem] gap-[1rem] md:w-3/4 h-[100%] min-h-[200px] w-full shadow-[0_0_4px_#1a1a1a] rounded bg-white">
                <div>
                    <button className="cursor-pointer text-gray-700 text-[0.9rem]" type="button" onClick={deleteAllFiles}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
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
                        deleteOne={deleteOneFile}
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