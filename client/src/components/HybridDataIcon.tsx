import type { HybridOptionIntrf } from "../models/hybrid.model";
import { Database, FolderArchive, File, AudioLines, Sheet, FileChartColumn, FileText, FileTypeCorner, Table, Paperclip, Folder } from "lucide-react";
import { Link } from "react-router-dom";

export default function HybridDataIcon(props: Pick<HybridOptionIntrf, 'fileAndFolder'>) {
    return (
        <>
            {props.fileAndFolder.category === "files" ? (
                props.fileAndFolder.file_type?.startsWith('image/') ? (
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <img 
                                src={props.fileAndFolder.files?.url} 
                                alt={props.fileAndFolder.file_name}
                                className="aspect-square object-cover rounded-lg"
                            />
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.startsWith('video/') ? (
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <video 
                                src={props.fileAndFolder.files?.url} 
                                className="aspect-square object-cover rounded-lg"
                                controls
                            />
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.startsWith('audio/') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <AudioLines></AudioLines>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.startsWith('text/csv') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <Table></Table>
                        </div>
                    </div>
                ) :props.fileAndFolder.file_type?.startsWith('text/plain') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <Paperclip></Paperclip>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.includes('/pdf') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <FileTypeCorner></FileTypeCorner>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.includes('/zip') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <FolderArchive></FolderArchive>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.includes('/sql') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 border text-[1.7rem] border-gray-500 rounded">
                            <Database></Database>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.includes('.sheet') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <Sheet></Sheet>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.includes('.document') ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <FileText></FileText>
                        </div>
                    </div>
                ) : props.fileAndFolder.file_type?.includes('.presentation') ? (
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
                ) 
            ) : props.fileAndFolder.category === "folders" ? (
                <div className="flex flex-col gap-2">
                    <Link to={`/folder-content/branch/${props.fileAndFolder._id}`}>
                        <div className="flex justify-center items-center aspect-square text-gray-500 text-[1.7rem] border border-gray-500 rounded">
                            <Folder></Folder>
                        </div>
                    </Link>
                </div>
            ) : null}
        </>
    );
}