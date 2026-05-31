import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "./cloudinary_service";
import AuthServices from "./auth_service";
import DataModifier from "./data_service";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { FilesFormIntrf, MediaFilesProps } from "../models/fileModel";

export default function FileServices() {
    const { currentUserId } = AuthServices();
    const { insertData, message, setMessage } = DataModifier();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [mediaFiles, setMediaFiles] = useState<MediaFilesProps[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

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

    function removeChosenFiles(index: number) {
        const file = mediaFiles[index];
        URL.revokeObjectURL(file.preview_url);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }

    const getResourceType = (fileType: string): 'image' | 'video' | 'raw' => {
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.startsWith('video/')) return 'video';
        return 'raw';
    }

    const uploadFilesMutation = useMutation({
        onMutate: () => setIsUploading(true),
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
            setMessage(error.message || 'Check your internet connection');
        },
        onSuccess: (response) => {
            setMessage(response.message)
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            navigate(`/home/${currentUserId}`);
        },
        onSettled: () => {
            if (fileInputRef.current) fileInputRef.current.value = '';
            setIsUploading(false);
            setMediaFiles([]);
        }
    });
    
    return { fileInputRef, handleChosenFiles, isUploading, mediaFiles, message, navigate, removeChosenFiles, setMediaFiles, setMessage, uploadFilesMutation }
}