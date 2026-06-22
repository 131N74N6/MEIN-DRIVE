import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "./cloudinary.service";
import AuthServices from "./auth.service";
import DataModifier from "./data.service";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { FilesDataProps, FileServicesIntrf, FilesFormIntrf, MediaFilesProps } from "../models/file.model";
import useSearch from "../hooks/useSearch";
import type { HybridIntrf } from "../models/hybrid.model";

export default function FileServices(props?: FileServicesIntrf) {
    const { currentUserId } = AuthServices();
    const { changeData, deleteData, getData, infiniteScroll, insertData } = DataModifier();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [mediaFiles, setMediaFiles] = useState<MediaFilesProps[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { debouncedSearch, searchValue, setSearchValue } = useSearch();

    const [openFolderList, setOpenFolderList] = useState<boolean>(false);
    const [chosenFileId, setChosenFileId] = useState<string | null>(null);
    const [chosenFolder, setChosenFolder] = useState<string | null>(null);

    const addFileToFolderMt = useMutation({
        mutationFn: async () => {
            if (!chosenFolder || !chosenFileId) return;
            return await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add-to-folder/${chosenFileId}`,
                data: { folder_id: chosenFolder.trim() }
            });
        },
        onError: (error: Error) => {
            props?.setMessage(error.message || 'Failed to move file or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            setOpenFolderList(false);
            setChosenFileId(null);
            setChosenFolder(null);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-and-child-folders-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`);
                    }
                    return false;
                }
            });
        }
    });

    function closeFolderList() {
        setOpenFolderList(false);
        setChosenFileId(null);
        setChosenFolder(null);
    }
    
    const deleteAllFilesInFolderMt = useMutation({
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/rm-all-in-folder/${props?.folder_id}` });
        },
        onError: (error) => {
            props?.setMessage(error.message || 'Failed to delete or check your internet connection.');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith('is-favorited-');
                    }
                    return false;
                }
            });
        }
    });
    
    const deleteAllFilesMt = useMutation({
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/rm-all` });
        },
        onError: (error) => {
            props?.setMessage(error.message || 'Failed to delete or check your internet connection.');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith('is-favorited-');
                    }
                    return false;
                }
            });
        }
    });

    const deleteOneFileMt = useMutation({
        mutationFn: async (id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/rm/${id}` });
        },
        onError: (error) => {
            props?.setMessage(error.message || 'Failed to delete file or check your internet connection.');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-favorited-${currentUserId}`) ||
                        queryKey[0].startsWith(`files-and-child-folders-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`) ||
                        queryKey[0].startsWith('is-favorited-');
                    }
                    return false;
                }
            });
        }
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

    const moveOutsideFolderMt = useMutation({
        mutationFn: async (_id: string) => {
            return await changeData<FilesDataProps>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/files/remove-from-folder/${_id}`,
                data: {}
            });
        },
        onError: (error: Error) => {
            props?.setMessage(error.message || 'Failed to move file or check your internet connection');
        },
        onSuccess: (response) => {
            props?.setMessage(response.message);
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`files-and-child-folders-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`);
                    }
                    return false;
                }
            });
        }
    });

    function removeChosenFiles(index: number) {
        const file = mediaFiles[index];
        URL.revokeObjectURL(file.preview_url);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }

    function showFolderList(_id: string) {
        setChosenFileId(_id);
        setOpenFolderList(true);
    }
    
    const uploadFilesMutation = useMutation({
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
                await insertData<FilesFormIntrf>({
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
            props?.setMessage(error.message || 'Failed to upload or check your internet connection');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-files-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-${currentUserId}`);
                    }
                    return false;
                }
            });
            navigate('/home');
        },
        onSettled: () => {
            if (fileInputRef.current) fileInputRef.current.value = '';
            setMediaFiles([]);
        }
    });

    const { 
        error: fileError, fetchNextPage: fileNext, isFetchingNextPage: fileHasNext, 
        isLoading: fileLoad, isReachedEnd: fileEnd, paginatedData: fileData 
    } = infiniteScroll<HybridIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/all`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: debouncedSearch ? [`all-files-${currentUserId}-${debouncedSearch}`] : [`all-files-${currentUserId}-`],
        searched: debouncedSearch.trim(),
        stale_time: Infinity
    });

    const { 
        error: folderError, fetchNextPage: folderNext, isFetchingNextPage: folderHasNext, 
        isLoading: folderLoad, isReachedEnd: folderEnd, paginatedData: folderData 
    } = infiniteScroll<HybridIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/folders/all`,
        enabled: !!currentUserId,
        limit: 14,
        query_key: [`all-folder-prev-${currentUserId}`],
        searched: debouncedSearch.trim(),
        stale_time: Infinity
    });

    const allFilesOnly = { fileError, fileNext, fileHasNext, fileLoad, fileEnd, fileData };
    const foldersPreviewData = { folderError, folderNext, folderHasNext, folderLoad, folderEnd, folderData };

    const isFileProcessing = deleteAllFilesMt.isPending || 
    deleteAllFilesInFolderMt.isPending ||
    deleteOneFileMt.isPending || 
    addFileToFolderMt.isPending || 
    moveOutsideFolderMt.isPending;

    return { 
        addFileToFolderMt, closeFolderList, deleteAllFilesInFolderMt, deleteAllFilesMt, deleteOneFileMt, fileInputRef, 
        allFilesOnly, foldersPreviewData, getData, handleChosenFiles, isFileProcessing,
        mediaFiles, moveOutsideFolderMt, navigate, openFolderList, removeChosenFiles, 
        searchValue, setChosenFolder, setMediaFiles, setSearchValue, showFolderList, uploadFilesMutation 
    }
}