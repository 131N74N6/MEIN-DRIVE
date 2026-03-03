import type { FilesDataProps, MediaFilesProps } from "../models/fileModel";
import { Database, FolderArchive, File, Notebook, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner } from "lucide-react";

export function FileIcon(props: FilesDataProps) {
    return (
        <div>
            {props.file_type.startsWith('image/') ? (
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <img 
                            src={props.files.url} 
                            alt={props.file_name}
                            className="w-full h-50 object-cover rounded-lg"
                        />
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.startsWith('video/') ? (
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <video 
                            src={props.files.url} 
                            className="w-full h-50 object-cover rounded-lg"
                            controls
                        />
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.startsWith('audio/') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <AudioLines></AudioLines>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.startsWith('text/') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Notebook></Notebook>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.includes('/pdf') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileTypeCorner></FileTypeCorner>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.includes('/zip') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FolderArchive></FolderArchive>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.includes('/sql') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 border text-[1.7rem] border-gray-500 rounded">
                        <Database></Database>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.includes('.sheet') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Sheet></Sheet>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.includes('.document') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileText></FileText>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : props.file_type.includes('.presentation') ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileChartColumn></FileChartColumn>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <File></File>
                    </div>
                    <p className="line-clamp-1">{new Date(props.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file_name}</p>
                </div>
            )}
        </div>
    )
}

export function FileIconPreview(props: MediaFilesProps) {
    return (
        <div className="flex flex-col gap-4">
            {props.file_type.startsWith('image/') ? (
                <img 
                    src={props.preview_url} 
                    className="w-full h-50 object-cover rounded-lg"
                />
            ) : props.file_type.startsWith('video/') ? (
                <video 
                    src={props.preview_url}
                    className="w-full h-50 object-cover rounded-lg"
                    controls
                />
            ) : props.file_type.startsWith('audio/') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <AudioLines></AudioLines>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.startsWith('text/') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <Notebook></Notebook>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('/pdf') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FileTypeCorner></FileTypeCorner>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('/zip') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FolderArchive></FolderArchive>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('/sql') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <Database></Database>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('.sheet') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <Sheet></Sheet>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('.document') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FileText></FileText>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : props.file_type.includes('.presentation') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <FileChartColumn></FileChartColumn>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 w-full h-50 rounded-lg">
                    <div className="flex flex-col gap-4 items-center">
                        <File></File>
                        <p>{props.file_name}</p>
                    </div>
                </div>
            )}
        </div>
    )
}