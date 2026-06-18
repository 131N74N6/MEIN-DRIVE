import type { UseMutationResult } from "@tanstack/react-query";
import type { FilesDataProps } from "./file.client_models";

export type FileOptionIntrf = {
    file: FilesDataProps;
    handle_favorite: () => void;
    is_favorited: boolean;
    is_in_folder: boolean;
    is_option_show: boolean;
    is_processing: boolean;
    move_outside_folder: UseMutationResult<void, Error, string, void>
    on_delete: UseMutationResult<void, Error, string, void>;
    show_folder_list: (_id: string) => void;
    show_more_options: () => void;
}