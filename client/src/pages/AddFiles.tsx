import Notification from "../components/Notification";
import { X } from "lucide-react";
import FileIconPreview from "../components/FileIconPreview";
import FileServices from "../services/file.service";
import { useEffect } from "react";

export default function AddFiles() {
    const { 
        fileInputRef, 
        handleChosenFiles, 
        isProcessing, 
        mediaFiles, 
        message, 
        navigate, 
        removeChosenFiles, 
        setMessage, 
        uploadFilesMutation 
    } = FileServices();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);
    
    const uploadFiles = (event: React.FormEvent) => {
        event.preventDefault();
        uploadFilesMutation.mutate();
    }

    return (
        <section className="flex gap-[1rem] p-[1rem] md:flex-row flex-col h-screen">
            {message ? Notification(message) : null}
            <form onSubmit={uploadFiles} className="flex gap-[1.3rem] w-full p-4 flex-col bg-white backdrop-blur-lg h-full shadow-[0_0_4px_#1a1a1a] rounded">
                <input onChange={handleChosenFiles} multiple type="file" ref={fileInputRef} className="hidden"/>
                <div className="border-dashed h-full overflow-y-auto p-4 cursor-pointer border-2 border-gray-400 rounded-lg" onClick={() => fileInputRef.current?.click()}>
                    {mediaFiles.length === 0 ? (                    
                        <div className="flex flex-col items-center h-full justify-center text-gray-600">
                            <span className="text-lg">Click to select images or videos</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 w-full relative group">
                            {mediaFiles.map((mediaFile, index) => (
                                <div className="relative" key={`${mediaFile.file_name}_${index}`}>
                                    <FileIconPreview {...mediaFile}/>
                                    <button
                                        type="button"
                                        disabled={isProcessing}
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
                        disabled={isProcessing}
                        className="rounded-md bg-gray-700 text-white text-[0.9rem] p-[0.4rem] font-[500] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
                        onClick={() => navigate('/home')}
                    >
                        {isProcessing ? 'Uploading' : 'Back'}
                    </button>
                    <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="rounded-md bg-blue-700 text-white text-[0.9rem] p-[0.4rem] font-[500] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    >
                        {isProcessing ? 'Uploading' : 'Upload'}
                    </button>
                </div>
            </form>
        </section>
    );
}