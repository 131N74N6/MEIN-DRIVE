import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FavoritedFileDataProps, FileItemProps } from "../services/type.service";
import DataModifier from "../services/data.service";
import { Star, Trash } from "lucide-react";

export default function FileItem(props: FileItemProps) {
    const queryClient = useQueryClient();
    const { getData, insertData } = DataModifier();

    const { data: isFavorited } = getData<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/favorited/is-favorite?user_id=${props.file.user_id}&file_id=${props.file._id}`,
        query_key: [`is-favorited-${[props.file.user_id]}-${props.file._id}`],
        stale_time: 600000
    });

    const addToFavoriteMutation = useMutation({
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
        }
    });

    function handleFavoriteButton() {
        if (isFavorited) props.removeOneFavoriteMt.mutate(props.file._id);
        else addToFavoriteMutation.mutate();
    }

    return (
        <div className="shadow-[0_0_4px_#1a1a1a] p-[0.7rem] flex flex-col gap-[0.5rem]">
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
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-headphones"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('text/') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/pdf') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/x-zip') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file-zipper"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.sheet') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file-excel"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.document') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file-word"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.presentation') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file-powerpoint"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-700 text-[1.7rem] border border-gray-700">
                        <i className="fa-solid fa-file"></i>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            )}
            <hr className="bg-gray-700"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button 
                    type="button" 
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] ${isFavorited ? 'text-blue-600' : 'text-gray-700'}`}
                >
                    <Star></Star>
                </button>
                <button type="button" onClick={() => props.deleteOne(props.file._id)} className="cursor-pointer text-gray-700 font-[500] text-[1rem]">
                    <Trash></Trash>
                </button>
            </div>
        </div>
    );
}