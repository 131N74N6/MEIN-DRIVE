import type { FavoriteItemProps } from "../services/type.service";
import { Trash, Database, FolderArchive, File, Notebook, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner } from "lucide-react";

export default function FavoriteFile(props: FavoriteItemProps) {
    return (
        <div className="border border-gray-500 rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            {props.file.file_type.startsWith('image/') ? (
                <>
                    <div className="relative">
                        <img 
                            src={props.file.files.url} 
                            alt={props.file.file_name}
                            className="w-full h-50 object-cover rounded-lg"
                        />
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('video/') ? (
                <>
                    <div className="relative">
                        <video 
                            src={props.file.files.url} 
                            className="w-full h-50 object-cover rounded-lg"
                            controls
                        />
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('audio/') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <AudioLines></AudioLines>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('text/') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Notebook></Notebook>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/pdf') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileTypeCorner></FileTypeCorner>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/zip') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FolderArchive></FolderArchive>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/sql') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Database></Database>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.sheet') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <Sheet></Sheet>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.document') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileText></FileText>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.presentation') ? (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <FileChartColumn></FileChartColumn>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center h-50 text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                        <File></File>
                    </div>
                    <p className="line-clamp-1">{new Date(props.file.created_at).toLocaleString()}</p>
                    <p className="line-clamp-1">{props.file.file_name}</p>
                </>
            )}
            <hr className="bg-gray-700"/>
            <div className="flex gap-[0.5rem] opacity-0 hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => props.deleteOne(props.file._id)} className="cursor-pointer text-gray-700 font-[500] text-[1rem]">
                    <Trash></Trash>
                </button>
            </div>
        </div>
    );
}