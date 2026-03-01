import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

export type FavoriteListProps = {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    favorites: FavoritedFileDataProps[];
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
}

export type FavoriteItemProps = {
    file: FavoritedFileDataProps;
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