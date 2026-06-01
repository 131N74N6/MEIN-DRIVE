import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { GetDataProps } from "./data_model";

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
    folder_name: string;
    is_favorited: boolean;
    user_id: string;
}

export type FilesFormIntrf = Omit<FilesDataProps, "folder_name" | "is_favorited">;

export type FileListProps = {
    add_to_favorite: UseMutationResult<void, Error, string, void>;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    files: FilesDataProps[];
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isFetchingNextPage: boolean;
    is_processing: boolean;
    isReachedEnd: boolean;
    move_outside_folder: UseMutationResult<void, Error, string, void>;
    on_delete: UseMutationResult<void, Error, string, void>;
    remove_from_favorite: UseMutationResult<void, Error, string, void>;
    showFolderList: (_id: string) => void;
}

export type FileItemProps = {
    add_to_favorite: UseMutationResult<void, Error, string, void>;
    file: FilesDataProps;
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    is_in_folder: boolean;
    is_processing: boolean;
    move_outside_folder: UseMutationResult<void, Error, string, void>;
    on_delete: UseMutationResult<void, Error, string, void>;
    remove_from_favorite: UseMutationResult<void, Error, string, void>;
    showFolderList: (_id: string) => void;
}

export type FileServicesIntrf = {
    folder_name?: string;
    id?:string;
    user_id?: string;
}