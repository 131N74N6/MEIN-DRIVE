import type { FolderListIntrf } from "../client_models/folder.client_models";
import FolderItem from "./FolderItem";
import Loading from "./Loading";

export default function FolderList(props: FolderListIntrf) {
    return (
        <div className="flex flex-col gap-[1rem] px-4 pt-4 overflow-y-auto">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {props.folders.map((folder, index) => (
                    <FolderItem 
                        {...folder} 
                        add_to_favorite={props.add_to_favorite}
                        get_data={props.get_data}
                        is_processing={props.is_processing}
                        is_selected={props.selected_folder_id === folder._id}
                        key={`folder-${index}`} 
                        move_outside_parent_folder={props.move_outside_parent_folder}
                        on_delete={props.on_delete}
                        on_edit={props.on_edit} 
                        on_select={props.on_select} 
                        parent_folder_id={props.parent_folder_id}
                        remove_from_favorite={props.remove_from_favorite}
                        selected_folder_id={props.selected_folder_id}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ?  (
                    <Loading/>
                ) : props.folders.length < 14 ? (
                    <></>
                ) : props.isReachedEnd ? (
                    <p className="text-gray-700 font-[500] text-center text-[1rem]">No More Files to Show</p>
                ) : (
                    <button 
                        type="button" onClick={() => props.fetchNextPage()} 
                        className="bg-blue-600 cursor-pointer w-[90px] text-white font-[500] p-[0.4rem] text-[0.9rem]"
                    >
                        <span>Show More</span>
                    </button>
                )}
            </div>
        </div>
    );
}