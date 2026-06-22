import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import type { GetDataProps } from "./data.model";
import type { HybridIntrf } from "./hybrid.model";

export type FolderIntrf = {
    _id: string;
    created_at: string;
    folder_name: string;
    is_favorited: boolean;
    user_id: string;
    parent_folder_id?: string;
}

export type FolderFormProps = Omit<FolderIntrf, "is_favorited">;

export type FolderItemPrevIntrf = {
    _id: string;
    folder_name: string;
    move: UseMutationResult<void, Error, void, unknown>;
    set_chosen_folder: Dispatch<SetStateAction<string | null>>;
}

export type FolderListPrevIntrf = {
    chosen_folder_id?: string | null;
    error: Error | null;
    for: string;
    folder_prev: HybridIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    isLoading: boolean;
    isFetchingNextPage: boolean
    isReachedEnd: boolean;
    message: string;
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
    message: string | null;
}

export type ChildFolderFormIntrf = {
    closed_form: () => void;
    folder_name: string;
    is_making: boolean;
    set_folder_name: (value: React.SetStateAction<string>) => void;
    submit_folder: UseMutationResult<any, Error, string, unknown>;
    message: string | null;
    parent_folder_id: string;
}

export type FolderItemIntrf = {
    folder: FolderIntrf;
    add_to_favorite: UseMutationResult<void, Error, string, unknown>;
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    is_selected: boolean;
    is_processing: boolean;
    move_outside_parent_folder?: UseMutationResult<any, Error, string, unknown>;
    on_delete: UseMutationResult<any, Error, string, unknown>;
    on_edit: UseMutationResult<any, Error, Pick<FolderIntrf, "_id" | "folder_name">, unknown>;
    on_select: (id: string) => void;
    remove_from_favorite: UseMutationResult<any, Error, string, unknown>;
    show_folder_list: (_id: string) => void;
}

export type FolderListIntrf = {
    add_to_favorite: UseMutationResult<void, Error, string, unknown>;
    folders: FolderIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    get_data: <X>(props: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    is_processing: boolean;
    move_outside_parent_folder?: UseMutationResult<any, Error, string, unknown>;
    on_delete: UseMutationResult<any, Error, string, unknown>;
    on_edit: UseMutationResult<any, Error, Pick<FolderIntrf, "_id" | "folder_name">, unknown>;
    on_select: (id: string) => void;
    remove_from_favorite: UseMutationResult<any, Error, string, unknown>;
    selected_folder_id: string | null;
    show_folder_list: (_id: string) => void;
}

export type FolderOptionIntrf = {
    folder: FolderIntrf;
    handle_favorite: () => void;
    is_favorited: boolean;
    is_processing: boolean;
    move_outside_parent_folder?: UseMutationResult<any, Error, string, unknown>;
    on_delete: UseMutationResult<any, Error, string, unknown>;
    on_select: (id: string) => void;
    show_folder_list: (_id: string) => void;
    show_more_options: () => void;
}

export type FolderServieIntrf = {
    parent_folder_id?: string;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export type ChildFolderIntrf = {
    created_at: string;
    folder_name: string;
    is_favorited: boolean;
    parent_folder_id: string;
    user_id: string;
}