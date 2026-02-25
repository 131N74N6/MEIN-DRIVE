import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

export type AuthStateProps = {
    user: UserTokenProps | null;
    loading: boolean;
    error: string | null;
    userId: string;
    username: string;
    email: string;
    createdAt: string;
    token: string;
}

export type AuthActionProps =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: UserTokenProps | null }
  | { type: 'SET_USER_DATA'; payload: Partial<Pick<AuthStateProps, 'userId' | 'username' | 'email' | 'createdAt'>> }
  | { type: 'RESET_STATE' };

export type ChangeDataProps<A> = {
    api_url: string;
    data: Partial<Omit<A, '_id'>>;
}

export type DeleteDataProps = {
    api_url: string;
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

export type FileItemProps = {
    file: FilesDataProps;
    deleteOne: (id: string) => void;
}

export type FileListProps = {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    files: FilesDataProps[];
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    deleteOne: (id: string) => void;
}

export type GetDataProps = {
    api_url: string;
    stale_time: number;
    query_key: string[];
}

export type GetCurrentUserProps = {
    created_at: string;
    email: string;
    user_id: string;
    username: string;
}

export type InfiniteScrollProps = {
    api_url: string;
    limit: number;
    stale_time: number;
    query_key: string[];
    searched?: string;
}

export type InputDataProps<A> = {
    api_url: string;
    data: Omit<A, '_id'>;
}

export type MediaFilesProps = {
    file: File;
    file_name: string;
    file_type: string;
    preview_url: string;
}

export type ProtectedRouteProps = {
    children: ReactNode;
}

export type SignUpProps = {
    created_at: string;
    email: string;
    password: string;
    username: string;
}

export type UserTokenProps = {
    status: string;
    user_id: string;
    token: string;
}

export type UploadResult = {
    file_name: string;
    file_type: string;
    url: string;
    public_id: string;
    resource_type: string;
}

export type UserFilesProps = {
    created_at: string;
    files: {
        public_id: string;
        url: string;
    };
    file_name: string;
    user_id: string;
}