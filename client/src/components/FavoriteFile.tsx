import type { FileItemProps } from "../services/custom-types";

export default function FileItem(props: FileItemProps) {
    return (
        <div className="shadow-[0_0_4px_#1a1a1a] p-[0.5rem]">
            {props.file.file_type.startsWith('image/') ? (
                <>
                    <div className="relative">
                        <img 
                            src={props.file.files.url} 
                            alt={props.file.file_name}
                            className="w-full h-50 object-cover rounded-lg"
                        />
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
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
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('audio/') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-headphones"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.startsWith('text/') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/pdf') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/zip') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file-zipper"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('/sql') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-database"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.sheet') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file-excel"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.document') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file-word"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : props.file.file_type.includes('.presentation') ? (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file-powerpoint"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center text-gray-700 border border-gray-700">
                        <i className="fa-solid fa-file"></i>
                    </div>
                    <p>{new Date(props.file.created_at).toLocaleString()} {props.file.file_name}</p>
                </>
            )}
            <div className="p-[1rem] opacity-0 hover:opacity-100 transition-opacity">
                <button type="button" className="cursor-pointer text-gray-700 font-[500] text-[1rem]">
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    );
}