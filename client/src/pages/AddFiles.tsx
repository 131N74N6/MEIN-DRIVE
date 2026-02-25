import { useEffect, useRef, useState } from "react"
import type { FilesDataProps, MediaFilesProps } from "../services/type.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../services/auth.service";
import DataModifier from "../services/data.service";
import { uploadToCloudinary } from "../services/media-storage";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Notification from "../components/Notification";
import { useNavigate } from 'react-router-dom';
import { Database, FolderArchive, X, File, Notebook, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner } from "lucide-react";

export default function AddFiles() {
    const { currentUserId } = useAuth();
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
    }, [message]);

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
            const getCurrentDate = new Date();
            const uploadedFiles: { file_name: string; file_type: string; url: string; public_id: string; resource_type: string; }[] = [];

            if (mediaFiles.length === 0) {
                setMessage('Please select at least one file');
            }

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

            for (const uploadedFile of uploadedFiles) {
                await insertData<FilesDataProps>({
                    api_url: `${import.meta.env.VITE_API_BASE_URL}/files/add`,
                    data: {
                        created_at: getCurrentDate.toISOString(),
                        files: {
                            public_id: uploadedFile.public_id,
                            resource_type: uploadedFile.resource_type,
                            url: uploadedFile.url
                        },
                        file_name: uploadedFile.file_name,
                        file_type: uploadedFile.file_type,
                        user_id: currentUserId
                    },
                });
            }
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            navigate('/home')
        },
        onSettled: () => {
            setIsUploading(false);
            setMediaFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    });

    const uploadFiles = (event: React.FormEvent) => {
        event.preventDefault();
        uploadFilesMutation.mutate();
    }

    return (
        <section className="flex gap-[1rem] p-[1rem] md:flex-row flex-col h-screen">
            {message ? Notification(message) : null}
            <form onSubmit={uploadFiles} className="flex gap-[1.3rem] md:w-3/4 w-full p-4 flex-col bg-white backdrop-blur-lg overflow-y-auto shadow-[0_0_4px_#1a1a1a] rounded">
                <input onChange={handleChosenFiles} multiple type="file" ref={fileInputRef} className="hidden"/>
                <div className="border-dashed h-screen p-4 cursor-pointer border-2 border-gray-400 rounded-lg overflow-x-auto flex flex-col" onClick={() => fileInputRef.current?.click()}>
                    {mediaFiles.length === 0 ? (                    
                        <div className="flex flex-col items-center justify-center text-gray-600">
                            <span className="text-lg">Click to select images or videos</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full relative group">
                            {mediaFiles.map((mediaFile, index) => (
                                <div className="relative" key={`${mediaFile.file_name}_${index}`}>
                                    {mediaFile.file_type.startsWith('image/') ? (
                                        <img 
                                            src={mediaFile.preview_url} 
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-50 object-cover rounded-lg"
                                        />
                                    ) : mediaFile.file_type.startsWith('video/') ? (
                                        <video 
                                            src={mediaFile.preview_url}
                                            className="w-full h-50 object-cover rounded-lg"
                                            controls
                                        />
                                    ) : mediaFile.file_type.startsWith('audio/') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <AudioLines></AudioLines>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.startsWith('text/') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <Notebook></Notebook>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.includes('/pdf') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <FileTypeCorner></FileTypeCorner>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.includes('/zip') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <FolderArchive></FolderArchive>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.includes('/sql') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <Database></Database>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.includes('.sheet') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <Sheet></Sheet>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.includes('.document') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <FileText></FileText>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : mediaFile.file_type.includes('.presentation') ? (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <FileChartColumn></FileChartColumn>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                            <File></File>
                                            <p>{mediaFile.file_name}</p>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        disabled={isUploading}
                                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            e.stopPropagation();
                                            removeChosenFiles(index);
                                        }}
                                        className="cursor-pointer absolute top-1 right-1 bg-[rgba(0,0,0,0.55)] text-white rounded-full w-6 h-6 flex justify-center items-center disabled:opacity-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} color="white"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.5rem]">
                    <button 
                        type="button" 
                        disabled={isUploading}
                        className="rounded-md bg-gray-700 text-white text-[0.9rem] p-[0.4rem] font-[500] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
                        onClick={() => navigate('/home')}
                    >
                        {isUploading ? 'Uploading' : 'Back'}
                    </button>
                    <button 
                        type="submit" 
                        disabled={isUploading || mediaFiles.length === 0}
                        className="rounded-md bg-blue-700 text-white text-[0.9rem] p-[0.4rem] font-[500] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    >
                        {isUploading ? 'Uploading' : 'Upload'}
                    </button>
                </div>
            </form>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}