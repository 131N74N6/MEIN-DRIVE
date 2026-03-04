import { X } from "lucide-react";
import type { FolderFormIntrf } from "../models/folderModel";

export default function FolderForm(props: FolderFormIntrf) {
    return (
        <div className='flex justify-center items-center fixed inset-0 z-20 border bg-[rgba(0,0,0,0.66)] p-3'>
            <form onSubmit={props.submit_folder} className="bg-white flex flex-col gap-[1rem] p-[1rem] w-[300px] border border-white">
                <button 
                    onClick={props.closed_form}
                    disabled={props.is_making}
                    type="button" 
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X></X>
                </button>
                <input 
                    type='text'
                    value={props.folder_name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.set_folder_name(event.target.value)}
                    className="border border-gray-600 text-gray-600 font-medium p-2 text-md outline-0"
                />
                <button 
                    type='submit'
                    className="cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white font-medium p-2 text-md"
                    disabled={props.is_making}
                >
                    Create Folder
                </button>
                {props.message ? <p className="text-red-600 font-medium text-center">{props.message}</p> : null}
            </form>
        </div>
    );
}