import { useRef, useState } from "react"
import type { AddFilesProps, MediaFilesProps } from "../services/custom-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../services/useAuth";

export default function AddFiles(props: AddFilesProps) {
    const { user } = useAuth();
    const currentUserId = user ? user.signin_user_id : '';
    const queryClient = useQueryClient();

    const [mediaFiles, setMediaFiles] = useState<MediaFilesProps[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChosenFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const chosenFiles: MediaFilesProps[] = [];

        if (!files || files.length === 0) return;

        for (const file of files) {
            chosenFiles.push({
                file: file,
                file_name: file.name,
                file_type: file.type,
                preview_url: URL.createObjectURL(file)
            });
        }

        setMediaFiles(prev => [...prev, ...chosenFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const removeChosenFiles = (index: number) => {
        const file = mediaFiles[index];
        URL.revokeObjectURL(file.preview_url);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }

    const uploadFilesMutation = useMutation({
        onMutate: () => setIsUploading(true),
        mutationFn: async () => {},
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`files-${currentUserId}`] }),
        onSettled: () => setIsUploading(false)
    });

    const uploadFiles = (event: React.FormEvent) => {
        event.preventDefault();
        uploadFilesMutation.mutate();
    }

    return (
        <div className="flex justify-center items-center fixed inset-0 z-20 bg-[rgba(0,0,0,0.66)]">
            <form onSubmit={uploadFiles} className="flex flex-col gap-[1rem]">
                <input onChange={handleChosenFiles} type="file" ref={fileInputRef} className="hidden"/>
                {mediaFiles.length === 0 ? (                    
                    <div className="flex flex-col items-center justify-center text-purple-400" onClick={() => fileInputRef.current?.click()}>
                        <span className="text-lg">Click to select images or videos</span>
                    </div>
                ) : (
                    <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] p-[1rem]">
                        {mediaFiles.map((mediaFile, index) => (
                            <div className="relative">
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
                                ) : mediaFile.file_type.startsWith('text/') ? (
                                    <div className="flex justify-center items-center text-white border border-white">
                                        <i className="fa-solid fa-file-lines"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_name.includes('.pdf') ? (
                                    <div className="flex justify-center items-center text-white border border-white">
                                        <i className="fa-solid fa-file-pdf"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_name.includes('.xlsx') || mediaFile.file_name.includes('.csv') ? (
                                    <div className="flex justify-center items-center text-white border border-white">
                                        <i className="fa-solid fa-file-excel"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_name.includes('.docx') ? (
                                    <div className="flex justify-center items-center text-white border border-white">
                                        <i className="fa-solid fa-file-word"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_name.includes('.pptx') ? (
                                    <div className="flex justify-center items-center text-white border border-white">
                                        <i className="fa-solid fa-file-powerpoint"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center text-white border border-white">
                                        <i className="fa-solid fa-file"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                )}
                                <button 
                                    type="button"
                                    className="bg-green-800 text-[1rem] text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                        event.stopPropagation();
                                        removeChosenFiles(index);
                                    }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.5rem]">                    
                    <button 
                        type="submit" 
                        disabled={isUploading}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    >
                        Upload
                    </button>
                    <button 
                        type="button" 
                        disabled={isUploading}
                        onClick={() => props.setOpenUploader(false)}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}