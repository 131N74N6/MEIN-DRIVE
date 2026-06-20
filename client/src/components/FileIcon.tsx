import type { FilesDataProps } from "../client_models/file.client_model";
import { Database, FolderArchive, File, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner, Table, Paperclip } from "lucide-react";

export default function FileIcon(props: FilesDataProps) {
    return (
        <div>
            {props.file_type.startsWith('image/') ? (
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <img 
                            src={props.files.url} 
                            alt={props.file_name}
                            className="aspect-square object-cover rounded-lg"
                        />
                    </div>
                </div>
            ) : props.file_type.startsWith('video/') ? (
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <video 
                            src={props.files.url} 
                            className="aspect-square object-cover rounded-lg"
                            controls
                        />
                    </div>
                </div>
            ) : props.file_type.startsWith('audio/') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <AudioLines></AudioLines>
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
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileTypeCorner></FileTypeCorner>
                    </div>
                </div>
            ) : props.file_type.includes('/zip') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FolderArchive></FolderArchive>
                    </div>
                </div>
            ) : props.file_type.includes('/sql') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 border text-[1.7rem] border-gray-500 rounded">
                        <Database></Database>
                    </div>
                </div>
            ) : props.file_type.includes('.sheet') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Sheet></Sheet>
                    </div>
                </div>
            ) : props.file_type.includes('.document') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileText></FileText>
                    </div>
                </div>
            ) : props.file_type.includes('.presentation') ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileChartColumn></FileChartColumn>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <File></File>
                    </div>
                </div>
            )}
        </div>
    );
}