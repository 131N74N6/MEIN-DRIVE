import type { MediaFilesProps } from "../client_models/file.client_model";
import { Database, FolderArchive, File, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner, Table, Paperclip } from "lucide-react";

export default function FileIconPreview(props: MediaFilesProps) {
    return (
        <div className="flex flex-col gap-4">
            {props.file_type.startsWith('image/') ? (
                <img 
                    src={props.preview_url} 
                    className="aspect-square object-cover rounded-lg"
                />
            ) : props.file_type.startsWith('video/') ? (
                <video 
                    src={props.preview_url}
                    className="aspect-square object-cover rounded-lg"
                    controls
                />
            ) : props.file_type.startsWith('audio/') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <AudioLines></AudioLines>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.startsWith('text/csv') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Table></Table>
                    </div>
                </div>
            ) :props.file_type.startsWith('text/plain') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Paperclip></Paperclip>
                    </div>
                </div>
            ) : props.file_type.includes('/pdf') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FileTypeCorner></FileTypeCorner>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('/zip') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FolderArchive></FolderArchive>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('/sql') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <Database></Database>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('.sheet') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <Sheet></Sheet>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('.document') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FileText></FileText>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('.presentation') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FileChartColumn></FileChartColumn>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <File></File>
                        <p className="line-clamp-1">{props.file_name}</p>
                    </div>
                </div>
            )}
        </div>
    );
}