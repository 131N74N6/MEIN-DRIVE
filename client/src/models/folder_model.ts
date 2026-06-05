import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import type { GetDataProps } from "./data_model";

export type FolderIntrf = {
    _id: string;
    created_at: string;
    folder_name: string;
    is_favorited: boolean;
    user_id: string;
}

export type FolderFormProps = Omit<FolderIntrf, "is_favorited">;

export type FolderItemPrevIntrf = {
    _id: string;
    folder_name: string;
    move: UseMutationResult<void, Error, void, unknown>;
    set_chosen_folder: Dispatch<SetStateAction<string | null>>;
}

export type FolderListPrevIntrf = {
    error: Error | null;
    folder_prev: FolderIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    isLoading: boolean;
    isFetchingNextPage: boolean
    isReachedEnd: boolean;
    move: UseMutationResult<void, Error, void, unknown>;
    toggle: () => void;
    set_chosen_folder: Dispatch<SetStateAction<string | null>>;
}

export type FolderFormIntrf = {
    closed_form: () => void;
    folder_name: string;
    is_making: boolean;
    set_folder_name: (value: React.SetStateAction<string>) => void;
    submit_folder: (event: React.FormEvent<Element>) => void;
    message: string | null
}

export type FolderItemIntrf = {
    add_to_favorite: UseMutationResult<void, Error, string, unknown>;
    _id: string;
    is_selected: boolean;
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    created_at: string;
    folder_name: string;
    is_processing: boolean;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_edit: UseMutationResult<void, Error, Pick<FolderIntrf, '_id' | 'folder_name'>, void>;
    on_select: (id: string) => void;
    remove_from_favorite: UseMutationResult<any, Error, string, void>;
    selected_folder_id: string | null;
}

export type FolderListIntrf = {
    add_to_favorite: UseMutationResult<void, Error, string, unknown>;
    folders: FolderIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    is_processing: boolean;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_edit: UseMutationResult<void, Error, Pick<FolderIntrf, '_id' | 'folder_name'>, void>;
    on_select: (id: string) => void;
    remove_from_favorite: UseMutationResult<any, Error, string, void>;
    selected_folder_id: string | null;
}

export type FolderOptionIntrf = {
    _id: string;
    created_at: string;
    handle_favorite: () => void;
    is_favorited: boolean;
    is_processing: boolean;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_select: (id: string) => void;
    show_more_options: () => void;
}