import { AudioLines } from "lucide-react";
import type { FileViewerIntrf } from "../client_models/file.client_model";

export default function FileViewer(props: FileViewerIntrf) {
    return (
        <div className="flex flex-col gap-2.5 h-full overflow-y-auto px-2.5 pt-2.5">
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
            ) : (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
                        <AudioLines></AudioLines>
                        <audio 
                            src={props.file.files.url} 
                            controls 
                            typeof="audio/mpeg"
                            className="w-full h-auto max-h-96 object-contain"
                        />
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-2.5">
                <div>Data Added: {props.file.created_at}</div>
                <div>Filename: {props.file.file_name}</div>
                <div>Filetype: {props.file.file_type}</div>
            </div>
        </div>
    );
}