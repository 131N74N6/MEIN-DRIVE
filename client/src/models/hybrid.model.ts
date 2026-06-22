import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { GetDataProps } from "./data.model";
import type { FolderIntrf } from "./folder.model";

export type HybridIntrf = {
    _id: string;
    category: string;
    created_at: string;
    files?: {
        public_id: string;
        url: string;
        resource_type: string;
    };
    file_name?: string;
    file_type?: string;
    folder_id?: string;
    folder_name?: string;
    is_favorited: boolean;
    parent_folder_id?: string;
    user_id: string;
}

export type HybridListIntrf = {
    addToFavoriteMt: UseMutationResult<any, Error, string, unknown>;
    filesAndFolders: HybridIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    getData: <X>(Intrf: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    isReachedEnd: boolean;
    moveFileOutsideFolder?: UseMutationResult<any, Error, string, unknown>;
    moveChildFolderOutsideParentFolder?: UseMutationResult<any, Error, string, unknown>;
    onDeleteFile?: UseMutationResult<any, Error, string, unknown>;
    onDeleteFolder?: UseMutationResult<any, Error, string, unknown>;
    onEditFolder?: UseMutationResult<any, Error, Pick<FolderIntrf, "_id" | "folder_name">, unknown>;
    onSelectFolder?: (id: string) => void;
    removeFromFavoritedMt: UseMutationResult<any, Error, string, unknown>;
    selectedFolderId?: string | null;
    showFolderListForFile?: (_id: string) => void;
    showFolderListForFolder?: (_id: string) => void;
}

export type HybridItemIntrf = {
    addToFavoriteMt: UseMutationResult<any, Error, string, unknown>;
    fileAndFolder: HybridIntrf;
    getData: <X>(Intrf: GetDataProps) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isFileInFolder: boolean;
    isProcessing: boolean;
    isFolderSelected: boolean;
    moveFileOutsideFolder: UseMutationResult<any, Error, string, unknown>;
    moveChildFolderOutsideParentFolder?: UseMutationResult<any, Error, string, unknown>;
    onDeleteFile: UseMutationResult<any, Error, string, unknown>;
    onDeleteFolder: UseMutationResult<any, Error, string, unknown>;
    onEditFolder: UseMutationResult<any, Error, Pick<FolderIntrf, "_id" | "folder_name">, unknown>;
    onSelectFolder: (id: string) => void;
    removeFromFavoritedMt: UseMutationResult<any, Error, string, unknown>;
    showFolderListForFile: (_id: string) => void;
    showFolderListForFolder: (_id: string) => void;
}

export type HybridOptionIntrf = {
    fileAndFolder: HybridIntrf;
    handleFavorite: () => void;
    isFavorited: boolean;
    isFileInFolder: boolean;
    isFileOptionShow: boolean;
    isProcessing: boolean;
    moveFileOutsideFolder: UseMutationResult<any, Error, string, unknown>;
    moveChildFolderOutsideParentFolder?: UseMutationResult<any, Error, string, unknown>;
    onDeleteFile: UseMutationResult<any, Error, string, unknown>;
    onDeleteFolder: UseMutationResult<any, Error, string, unknown>;
    onSelectFolder: (id: string) => void;
    showFolderListForFile: (_id: string) => void;
    showFolderListForFolder: (_id: string) => void;
    showMoreOption: () => void;
}

export type HybridServiceIntrf = {
    parent_folder_id?: string;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}