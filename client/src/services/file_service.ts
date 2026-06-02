import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "./cloudinary_service";
import AuthServices from "./auth_service";
import DataModifier from "./data_service";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { FilesDataProps, FileServicesIntrf, FilesFormIntrf, MediaFilesProps } from "../models/file_model";
import useDebounce from "../hooks/useDebounce";
import type { FolderIntrf } from "../models/folder_model";

export default function FileServices(props?: FileServicesIntrf) {
    const { currentUserId } = AuthServices();
    const { changeData, deleteData, getData, infiniteScroll, insertData, message, setMessage } = DataModifier();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [mediaFiles, setMediaFiles] = useState<MediaFilesProps[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);

    const [openFolderList, setOpenFolderList] = useState<boolean>(false);
    const [chosenFileId, setChosenFileId] = useState<string | null>(null);
    const [chosenFolder, setChosenFolder] = useState<string | null>(null);

    const addToFavoriteMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add-to-favorited/${id}`,
                data: {}
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-favorited-files-${currentUserId}`) ||
                        queryKey[0].startsWith('is-file-favorited-');
                    }
                    return false;
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    function closeFolderList() {
        setOpenFolderList(false);
        setChosenFileId(null);
        setChosenFolder(null);
    }
    
    const deleteAllFilesInFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase-all-in-folder/${props?.folder_name}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or check your internet connection.');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-file-favorited-`) || 
                        queryKey[0].startsWith(`is-file-favorited-${currentUserId}`);
                    }
                    return false;
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });
    
    const deleteAllFilesMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or chech your internet connection.');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-${currentUserId}-`) ||
                        queryKey[0].startsWith(`is-file-favorited-`);
                    }
                    return false; 
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteOneFileMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase/${id}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-${currentUserId}-`) ||
                        queryKey[0].startsWith('is-file-favorited-');
                    }
                    return false; 
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    const getResourceType = (fileType: string): 'image' | 'video' | 'raw' => {
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.startsWith('video/')) return 'video';
        return 'raw';
    }

    const handleChosenFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const chosenFiles: MediaFilesProps[] = [];

        if (!files || files.length === 0) return;

        for (let x = 0; x < files.length; x++) {
            chosenFiles.push({
                file: files[x],
                file_name: files[x].name,
                file_type: files[x].type,
                preview_url: URL.createObjectURL(files[x])
            });
        }

        setMediaFiles(prev => [...prev, ...chosenFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const insertFileToFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            if (!chosenFolder || !chosenFileId) return;
            return await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add-to-folder/${chosenFileId}`,
                data: { folder_name: chosenFolder.trim() }
            });
        },
        onError: (error: Error) => {
            setMessage(error.message || 'Failed to move file or check your internet connection');
        },
        onSuccess: () => {
            setOpenFolderList(false);
            setChosenFileId(null);
            setChosenFolder(null);
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false;
                }
            });
        },
        onSettled: () => {
            setIsProcessing(false);
        }
    });

    const moveOutsideFolderMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (_id: string) => {
            return await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/remove-from-folder/${_id}`,
                data: {}
            });
        },
        onError: (error: Error) => {
            setMessage(error.message || 'Failed to move file or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-in-folder-${currentUserId}-`);
                    }
                    return false; 
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });

    function removeChosenFiles(index: number) {
        const file = mediaFiles[index];
        URL.revokeObjectURL(file.preview_url);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }

    const removeFromFavoritedMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            return await changeData<FilesDataProps>({ 
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/remove-from-favorited/${id}`, 
                data: {}
            });
        },
        onError: (error: Error) => {
            setMessage(error.message || 'Failed to move file or check your internet connection');
        },
        onSuccess: () => {
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith('is-file-favorited-')
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    function showFolderList(_id: string) {
        setChosenFileId(_id);
        setOpenFolderList(true);
    }
    
    const uploadFilesMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            const folderName = 'drive_files';
            if (mediaFiles.length === 0) throw new Error('Please select at least one file');

            const uploadedFiles: { file_name: string; file_type: string; url: string; public_id: string; resource_type: string; }[] = [];

            for (const mediaFile of mediaFiles) {
                const result = await uploadToCloudinary(mediaFile.file, folderName);
                const resourceType = getResourceType(mediaFile.file_type);
                uploadedFiles.push({ 
                    file_name: result.file_name, 
                    file_type: result.file_type,
                    public_id: result.public_id, 
                    resource_type: resourceType,
                    url: result.url, 
                });
            }

            for (let y = 0; y < uploadedFiles.length; y++) {
                return await insertData<FilesFormIntrf>({
                    api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add`,
                    data: {
                        created_at: new Date().toISOString(),
                        files: {
                            public_id: uploadedFiles[y].public_id,
                            resource_type: uploadedFiles[y].resource_type,
                            url: uploadedFiles[y].url
                        },
                        file_name: uploadedFiles[y].file_name,
                        file_type: uploadedFiles[y].file_type,
                        user_id: currentUserId!,
                    },
                });
            }
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to upload or check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message)
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            navigate(`/home/${currentUserId}`);
        },
        onSettled: () => {
            if (fileInputRef.current) fileInputRef.current.value = '';
            setIsProcessing(false);
            setMediaFiles([]);
        }
    });

    const { 
        error: fileError, fetchNextPage: fileNext, isFetchingNextPage: fileHasNext, 
        isLoading: fileLoad, isReachedEnd: fileEnd, paginatedData: fileData 
    } = infiniteScroll<FilesDataProps>({
        api_url: currentUserId ? `${import.meta.env.VITE_API_BASE_URL}/files/get-all/${currentUserId}` : '',
        limit: 14,
        query_key: debouncedSearch ? [`all-files-${currentUserId}-${debouncedSearch}`] : [`all-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 1200000
    });

    const { 
        error: fileError2, fetchNextPage: fileNext2, isFetchingNextPage: fileHasNext2, 
        isLoading: fileLoad2, isReachedEnd: fileEnd2, paginatedData: fileData2 
    } = infiniteScroll<FilesDataProps>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/files-in-folder/${props?.folder_name}/${currentUserId}`,
        limit: 14,
        query_key: debouncedSearch ? [`files-in-folder-${currentUserId}-${props?.folder_name}-${debouncedSearch}`] : [`files-in-folder-${currentUserId}-${props?.folder_name}`],
        searched: debouncedSearch.trim(),
        stale_time: 1800000
    });

    const { error: fileError3, fetchNextPage: fileNext3, isFetchingNextPage: fileHasNext3, isLoading: fileLoad3, isReachedEnd: fileEnd3, paginatedData: fileData3 } = infiniteScroll<FilesDataProps>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/favorited/${currentUserId}`,
        limit: 14,
        query_key: debouncedSearch ? [`all-favorited-files-${currentUserId}-${debouncedSearch}`] : [`all-favorited-files-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 1200000
    });

    const { 
        error: folderError, fetchNextPage: folderNext, isFetchingNextPage: folderHasNext, 
        isLoading: folderLoad, isReachedEnd: folderEnd, paginatedData: folderData 
    } = infiniteScroll<FolderIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/get/${currentUserId}`,
        limit: 14,
        query_key: [`all-folder-prev-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: 1800000
    });

    const filesInFolderData = { fileError2, fileNext2, fileHasNext2, fileLoad2, fileEnd2, fileData2 };
    const foldersPreviewData = { folderError, folderNext, folderHasNext, folderLoad, folderEnd, folderData };
    const allFiles = { fileError, fileNext, fileHasNext, fileLoad, fileEnd, fileData };
    const favoritedFiles = { fileError3, fileNext3, fileHasNext3, fileLoad3, fileEnd3, fileData3 };

    return { 
        addToFavoriteMt, allFiles, closeFolderList, deleteAllFilesInFolderMt, deleteAllFilesMt, deleteOneFileMt, fileInputRef, 
        filesInFolderData, foldersPreviewData, favoritedFiles, getData, handleChosenFiles, insertFileToFolderMt, isProcessing, 
        mediaFiles, message, moveOutsideFolderMt, navigate, openFolderList, removeChosenFiles, removeFromFavoritedMt, 
        searchValue, setChosenFolder, setMediaFiles, setMessage, setSearchValue, showFolderList, uploadFilesMutation 
    }
}