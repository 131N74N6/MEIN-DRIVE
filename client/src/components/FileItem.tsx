import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FavoritedFileDataProps } from "../models/favoriteModel"
import type { FileItemProps } from "../models/fileModel";
import DataModifier from "../services/dataService";
import { Star, Trash, Database, FolderArchive, File, Notebook, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner } from "lucide-react";
import { useState } from "react";

export default function FileItem(props: FileItemProps) {
    const queryClient = useQueryClient();
    const { deleteData, getData, insertData } = DataModifier();
    const [isFavoriting, setIsFavoriting] = useState<boolean>(false);

    const { data: isFavorited } = getData<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/is-favorite?user_id=${props.file.user_id}&file_id=${props.file._id}`,
        query_key: [`is-favorited-${[props.file.user_id]}-${props.file._id}`],
        stale_time: 600000
    });

    const addToFavoriteMutation = useMutation({
        onMutate: () => setIsFavoriting(true),
        mutationFn: async () => {
            const getCurrentDate = new Date();
            await insertData<FavoritedFileDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/add`,
                data: {
                    created_at: getCurrentDate.toISOString(),
                    files: {
                        public_id: props.file.files.public_id,
                        resource_type: props.file.files.resource_type,
                        url: props.file.files.url
                    },
                    file_id: props.file._id,
                    file_name: props.file.file_name,
                    file_type: props.file.file_type,
                    user_id: props.file.user_id
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${[props.file.user_id]}-${props.file._id}`] });
        },
        onSettled: () => setIsFavoriting(false)
    });

    
    const removeOneFavoriteMutation = useMutation({
        onMutate: () => setIsFavoriting(true),
        mutationFn: async (_id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/erase/${_id}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${[props.file.user_id]}-${props.file._id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.file.user_id}`] });
        },
        onSettled: () => setIsFavoriting(false)
    });

    function handleFavoriteButton() {
        if (isFavorited) removeOneFavoriteMutation.mutate(props.file._id);
        else addToFavoriteMutation.mutate();
    }

    return (
        <div className="border-gray-500 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            {props.file.file_type.startsWith('image/') ? (
                <>
                    <div className="relative">
                        <img 
                            src={props.file.files.url} 
                            alt={props.file.file_name}
                            className="w-full h-50 object-cover rounded-lg"
                        />
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('video/') ? (
                <>
                    <div className="relative">
                        <video 
                            src={props.file.files.url} 
                            className="w-full h-50 object-cover rounded-lg"
                            controls
                        />
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('audio/') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <AudioLines></AudioLines>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('text/') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Notebook></Notebook>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/pdf') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileTypeCorner></FileTypeCorner>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/zip') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FolderArchive></FolderArchive>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/sql') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 border text-[1.7rem] border-gray-500 rounded">
                        <Database></Database>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.sheet') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Sheet></Sheet>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.document') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileText></FileText>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.presentation') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileChartColumn></FileChartColumn>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <File></File>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            )}
            <hr className="bg-gray-500"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button 
                    type="button" 
                    disabled={isFavoriting}
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Star></Star>
                </button>
                <button type="button" onClick={() => props.deleteOne(props.file._id)} className="cursor-pointer text-gray-500 font-[500] text-[1rem]">
                    <Trash></Trash>
                </button>
            </div>
        </div>
    );
}