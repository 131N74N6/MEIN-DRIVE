import { Folder, LucideCheckSquare2, Pen, Star, Trash, X } from "lucide-react";
import type { FolderItemIntrf, FolderItemPrevIntrf } from "../models/folderModel";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataModifier from "../services/dataService";
import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FilesDataProps } from "../models/fileModel";

export function FolderItem(props: FolderItemIntrf) {
    const { changeData, deleteData, getData } = DataModifier();
    const queryClient = useQueryClient();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [folderName, setFolderName] = useState<string>('');

    useEffect(() => {
        if (props.is_selected) {
            setFolderName(props.folder_name);
        } else {
            setFolderName('');
        }
    }, [props.is_selected, props._id]);

    const { data: isFavorited } = getData<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/is-favorited/${props._id}`,
        query_key: [`is-folder-favorited-${props._id}`],
        stale_time: 1200000
    });
    
    const addToFavoriteMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/add-to-favorited/${props._id}`,
                data: {}
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-favorited-folders-${props.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-folder-favorited-${props._id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const removeFromFavoritedMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await changeData<FilesDataProps>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/remove-from-favorited/${props._id}`, 
                data: {}
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`is-folder-favorited-${props._id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-folders-${props.user_id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const removeOneFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/delete/${props.user_id}/${props.folder_name}` });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-folders-${props.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`is-folder-favorited-${props._id}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`);
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-folders-prev-${props.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-files-${props.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${props.user_id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });
    
    function updateFolderName(event: React.FormEvent) {
        event.preventDefault();
        props.changeOne.mutate({ _id: props._id, folder_name: folderName.trim() });
    }

    function handleFavoriteButton() {
        if (isFavorited) removeFromFavoritedMt.mutate();
        else addToFavoriteMt.mutate();
    }

    const cancel = () => props.selectOne(props._id);
    
    if (props.is_selected) {
        return (
            <form onSubmit={updateFolderName} className="border border-gray-600 flex p-4 justify-between rounded-md items-center">
                <div className="flex gap-2 items-center">
                    <Folder/>
                    <input 
                        type="text"
                        value={folderName}
                        className="border border-gray-600 p-2 text-md text-gray-700 rounded-md" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFolderName(event.target.value)}
                    />
                    <p>{new Date(props.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LucideCheckSquare2/>
                    </button>
                    <button 
                        type="button" 
                        disabled={isProcessing}
                        onClick={cancel}
                        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X/>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center">
            <div className="flex gap-2 items-center">
                <Folder/>
                <Link to={`/folder-files/${props.folder_name}`}>
                    <p className="line-clamp-1">{props.folder_name}</p>
                </Link>
                <p>{new Date(props.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-3 items-center">
                <button 
                    type="button" 
                    disabled={isProcessing}
                    onClick={() => removeOneFolderMt.mutate()}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash/>
                </button>
                <button 
                    type="button" 
                    disabled={isProcessing}
                    onClick={() => props.selectOne(props._id)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Pen/>
                </button>
                <button 
                    type="button" 
                    disabled={isProcessing}
                    onClick={handleFavoriteButton}
                    className={`cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Star/>
                </button>
            </div>
        </div>
    );
}

export function FolderItemPreview(props: FolderItemPrevIntrf) {
    function moveToFolder() {
        props.set_chosen_folder(props.folder_name); 
        props.move.mutate();
    };
    
    return (
        <div className="border border-gray-600 flex p-4 justify-between rounded-md items-center cursor-pointer" onClick={moveToFolder}>
            <div className="flex gap-2 items-center">
                <Folder/>
                <div className="line-clamp-1">{props.folder_name}</div>
            </div>
        </div>
    );
}