import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

export type MediaFilesProps = {
    file: File;
    file_name: string;
    file_type: string;
    preview_url: string;
}

export type FileItemProps = {
    file: FilesDataProps;
    showFolderList: (props: FileInFolderIntrf) => void;
}

export type UploadResult = {
    file_name: string;
    file_type: string;
    url: string;
    public_id: string;
    resource_type: string;
}

export type FileListProps = {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    files: FilesDataProps[];
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    showFolderList: (props: FileInFolderIntrf) => void;
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
    user_id: string;
}

export type FileInFolderIntrf = {
    file_id: string;
    file_name: string;
    file_type: string;
    public_id: string;
    resource_type: string;
    url: string;
}