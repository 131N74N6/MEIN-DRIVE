import { useRef, useState } from "react"
import type { FilesDataProps, MediaFilesProps } from "../services/custom-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../services/useAuth";
import DataModifier from "../services/data-modifier";
import { uploadToCloudinary } from "../services/media-storage";
import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function AddFiles() {
    const { currentUserId, token } = useAuth();
    const { insertData } = DataModifier();
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
        mutationFn: async () => {
            const folderName = 'drive_files';
            const getCurrentDate = new Date();
            const uploadedFiles: { file_name: string; file_type: string; url: string; public_id: string; }[] = [];

            for (const mediaFile of mediaFiles) {
                const result = await uploadToCloudinary(mediaFile.file, folderName);
                uploadedFiles.push({ 
                    file_name: result.file_name, 
                    file_type: result.file_type,
                    public_id: result.public_id, 
                    url: result.url 
                });
            }

            for (const uploadedFile of uploadedFiles) {
                await insertData<FilesDataProps>({
                    api_url: `http://localhost:1234/files/add`,
                    data: {
                        created_at: getCurrentDate.toISOString(),
                        files: {
                            public_id: uploadedFile.public_id,
                            url: uploadedFile.url
                        },
                        file_name: uploadedFile.file_name,
                        file_type: uploadedFile.file_type,
                        user_id: currentUserId
                    },
                    token: token
                });
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] }),
        onSettled: () => setIsUploading(false)
    });

    const uploadFiles = (event: React.FormEvent) => {
        event.preventDefault();
        uploadFilesMutation.mutate();
    }

    return (
        <section className="flex gap-[1rem] p-[1rem] md:flex-row flex-col h-screen">
            <form onSubmit={uploadFiles} className="flex flex-col gap-[1rem] min-h-[679px] bg-white p-[1rem] w-full md:w-3/4 shadow-[0_0_4px_#1a1a1a] rounded">
                <input onChange={handleChosenFiles} multiple type="file" ref={fileInputRef} className="hidden"/>
                {mediaFiles.length === 0 ? (                    
                    <div className="flex items-center h-full justify-center text-gray-500 border border-dashed cursor-pointer border-gray-600" onClick={() => fileInputRef.current?.click()}>
                        <span className="text-lg">Click to select images or videos</span>
                    </div>
                ) : (
                    <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-[1rem] p-[1rem] border border-gray-400 overflow-y-auto">
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
                                        <i className="fa-solid fa-file-lines"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.startsWith('text/') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-headphones"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.includes('/pdf') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-file-pdf"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.includes('/zip') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-file-zipper"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.includes('/sql') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-database"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.includes('.sheet') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-file-excel"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.includes('.document') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-file-word"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : mediaFile.file_type.includes('.presentation') ? (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-file-powerpoint"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                                        <i className="fa-solid fa-file"></i>
                                        <p>{mediaFile.file_name}</p>
                                    </div>
                                )}
                                <button 
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-[1rem] w-6 h-6 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <Link className="bg-gray-700 text-white text-[0.9rem] p-[0.4rem] font-[500] cursor-pointer" to={'/home'}>Back</Link>
                    <button 
                        type="submit" 
                        disabled={isUploading}
                        className="bg-blue-700 text-white text-[0.9rem] p-[0.4rem] font-[500] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    >
                        Upload
                    </button>
                </div>
            </form>
            <Navbar1/>
            <Navbar2/>
        </section>
    );
}