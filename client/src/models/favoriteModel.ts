import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import type { FilesDataProps } from "./fileModel";

export type FavoriteListProps = {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    favorites: FilesDataProps[];
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    deleteOne: (id: string) => void;
}

export type FavoriteItemProps = {
    file: FilesDataProps;
    deleteOne: (id: string) => void;
}

export type FavoritedFileDataProps = {
    _id: string;
    created_at: string;
    files: {
        public_id: string;
        url: string;
        resource_type: string;
    }
    file_id: string;
    file_name: string;
    file_type: string;
    user_id: string;
}