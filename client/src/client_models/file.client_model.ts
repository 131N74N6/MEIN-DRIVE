import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { GetDataProps } from "./data.client_model";

export type MediaFilesProps = {
    file: File;
    file_name: string;
    file_type: string;
    preview_url: string;
}

export type UploadResult = {
    file_name: string;
    file_type: string;
    url: string;
    public_id: string;
    resource_type: string;
}

export type FilesDataProps = {
    _id: string;
    created_at: string;
    files: {
        public_id: string;
        url: string;
        resource_type: string;
    }
    file_name: string;
    file_type: string;
    folder_id: string;
    is_favorited: boolean;
    user_id: string;
}

export type FilesFormIntrf = Omit<FilesDataProps, "folder_id" | "is_favorited">;

export type FileListProps = {
    add_to_favorite: UseMutationResult<any, Error, string, unknown>;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    files: FilesDataProps[];
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isFetchingNextPage: boolean;
    is_processing: boolean;
    isReachedEnd: boolean;
    move_outside_folder: UseMutationResult<any, Error, string, unknown>;
    on_delete: UseMutationResult<any, Error, string, unknown>;
    remove_from_favorite: UseMutationResult<any, Error, string, unknown>;
    showFolderList: (_id: string) => void;
}

export type FileItemProps = {
    add_to_favorite: UseMutationResult<any, Error, string, unknown>;
    file: FilesDataProps;
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    is_in_folder: boolean;
    is_processing: boolean;
    move_outside_folder: UseMutationResult<any, Error, string, unknown>;
    on_delete: UseMutationResult<any, Error, string, unknown>;
    remove_from_favorite: UseMutationResult<any, Error, string, unknown>;
    showFolderList: (_id: string) => void;
}

export type FileOptionIntrf = {
    file: FilesDataProps;
    handle_favorite: () => void;
    is_favorited: boolean;
    is_in_folder: boolean;
    is_option_show: boolean;
    is_processing: boolean;
    move_outside_folder: UseMutationResult<any, Error, string, unknown>;
    on_delete: UseMutationResult<any, Error, string, unknown>;
    show_folder_list: (_id: string) => void;
    show_more_options: () => void;
}

export type FileServicesIntrf = {
    folder_id?: string;
    id?:string;
    user_id?: string;
}