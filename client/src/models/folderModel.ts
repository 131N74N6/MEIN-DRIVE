import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type FolderIntrf = {
    _id: string;
    created_at: string;
    folder_name: string;
    user_id: string;
}

export type FolderItemPrevIntrf = {
    _id: string;
    folder_name: string;
    move:  UseMutationResult<void, Error, string, unknown>;
}

export type FolderListPrevIntrf = {
    error: Error | null;
    folder_prev: FolderIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    isLoading: boolean;
    isFetchingNextPage: boolean
    isReachedEnd: boolean;
    move: UseMutationResult<void, Error, string, unknown>;
    toggle: () => void;
}

export type FolderFormIntrf = {
    closed_form: () => void;
    folder_name: string;
    is_making: boolean;
    set_folder_name: (value: React.SetStateAction<string>) => void;
    submit_folder: (event: React.FormEvent<Element>) => void;
}

export type FolderListIntrf = {
    folders: FolderIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    isFetchingNextPage: boolean
    isReachedEnd: boolean;
}

export type FolderDetailIntrf = {
    _id: string;
    created_at: string;
    folder_name: string;
    files: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        url: string;
    };
    user_id: string;
}