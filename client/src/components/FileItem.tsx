import type { FileItemProps } from "../client_models/file.client_models";
import { EllipsisVertical, View } from "lucide-react";
import FileIcon from "./FileIcon";
import { useState } from "react";
import FileItemOption from "./FileItemOption";
import { useNavigate } from "react-router-dom";

export default function FileItem(props: FileItemProps) {
    const navigate = useNavigate();
    const [showOption, setShowOption] = useState<boolean>(false);

    const { data: isFavorited } = props.get_data<boolean>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/is-favorited/${props.file._id}`,
        query_key: [`is-file-favorited-${props.file._id}`],
        stale_time: 1800000
    });

    const showMoreOptions = () => setShowOption(!showOption);

    function handleFavoriteButton() {
        if (isFavorited) props.remove_from_favorite.mutate(props.file._id);
        else props.add_to_favorite.mutate(props.file._id);
    }

    return (
        <div className="border-gray-500 border rounded-md p-[0.7rem] flex flex-col gap-[0.5rem]">
            {showOption ? (
                <FileItemOption
                    file={props.file}
                    handle_favorite={handleFavoriteButton}
                    is_favorited={isFavorited!}
                    is_in_folder={props.is_in_folder}
                    is_option_show={showOption}
                    is_processing={props.is_processing}
                    move_outside_folder={props.move_outside_folder}
                    on_delete={props.on_delete}
                    show_folder_list={props.showFolderList}
                    show_more_options={showMoreOptions}
                />
            ) : (
                <>
                    <FileIcon key={props.file._id} {...props.file}/>
                    <hr className="bg-gray-500"/>
                    <div className="flex gap-2">
                        <button 
                            type="button" 
                            disabled={props.is_processing}
                            onClick={showMoreOptions}
                            className='cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed text-gray-500'
                        >
                            <EllipsisVertical/>
                        </button>
                        <button 
                            type="button" 
                            disabled={props.is_processing}
                            onClick={() => navigate(`/file/${props.file._id}`)}
                            className='cursor-pointer font-[500] text-[1rem] disabled:opacity-50 disabled:cursor-not-allowed text-gray-500'
                        >
                            <View/>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}