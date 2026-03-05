import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

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
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    files: FilesDataProps[];
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    move_outside_folder: UseMutationResult<void, Error, string, void>;
    showFolderList: (_id: string) => void;
}

export type FileItemProps = {
    file: FilesDataProps;
    is_in_folder: boolean;
    move_outside_folder: UseMutationResult<void, Error, string, void>;
    showFolderList: (_id: string) => void;
}