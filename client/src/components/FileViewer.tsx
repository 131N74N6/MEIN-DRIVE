import { Download } from "lucide-react";
import type { FileViewerIntrf } from "../client_models/file.client_model";

export default function FileViewer(props: FileViewerIntrf) {
    const downloadFile = async () => {
        try {
            const response = await fetch(props.file.files.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = props.file.file_name || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.open(props.file.files.url, "_blank");
        }
    };

    return (
        <div className="flex flex-col gap-2.5 h-full overflow-y-auto">
            <div className="flex md:flex-row md:items-center md:justify-between flex-col gap-2.5">
                <div className="line-clamp-2">{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</div>
                <button 
                    type="button" 
                    className="cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-[6px] hover:bg-gray-400 transition-colors"
                    onClick={downloadFile}
                >
                    <Download></Download>
                    <div>Download</div>
                </button>
            </div>
            {props.file.file_type.startsWith("image/") ? (
                <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
                    <img 
                        src={props.file.files.url} 
                        className="w-full h-full object-contain"
                    />
                </div>
            ) : props.file.file_type.startsWith("video/") ? (
                <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
                    <video 
                        src={props.file.files.url} 
                        controls 
                        className="w-full h-auto max-h-96 object-contain"
                    />
                </div>
            ) : props.file.file_type.includes('.document') || 
                props.file.file_type.includes('.presentation') || 
                props.file.file_type.includes('.sheet') ||
                props.file.file_type.includes('/pdf') ||
                props.file.file_type.includes('text/plain') || 
                props.file.file_type.includes('text/csv') ? (
                <div className="border-gray-700 rounded-lg h-full">
                    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                        <iframe 
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(props.file.files.url)}&embedded=true`}
                            className="w-full h-full" 
                        ></iframe>
                    </div>
                </div>
            ) : props.file.file_type.startsWith('audio/') ? (
                <div className="text-white border-gray-700 flex justify-center items-center w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                    <div className="flex flex-col text-center">
                        <audio 
                            controls 
                            className="w-100"
                            style={{ filter: "invert(1)" }}
                        >
                            <source src={props.file.files.url} type={props.file.file_type} />
                            Your browser did't support audio player
                        </audio>
                    </div>
                </div>
            ) : props.file.file_type.includes("text/csv") ? (
                <div className="order-gray-700 rounded-lg h-full">
                    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                        <pre className="whitespace-pre-wrap">${props.file.files.url}</pre>
                    </div>
                </div>
            ) : (
                <div className="border-gray-700 border rounded-lg h-full">
                    <div className="flex justify-center h-full items-center">
                        <div className="font-bold">Ooopps... this file can't be shown</div>
                    </div>
                </div>
            )}
        </div>
    );
}