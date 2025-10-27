export type AddFilesProps = {
    setOpenUploader: (value: React.SetStateAction<boolean>) => void;
}

export type AuthStateProps = {
    user: UserTokenProps | null;
    loading: boolean;
    error: string | null;
    userId: string;
    username: string;
    email: string;
    createdAt: string;
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

export type FilesDataProps = {
    created_at: string;
    files: {
        public_id: string;
        url: string;
    }
    file_name: string;
    user_id: string;
}

export type FileItemProps = {
    file: FilesDataProps;
}

export type FileListProps = {
    files: FilesDataProps[];
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

export type SignUpProps = {
    created_at: string;
    email: string;
    password: string;
    username: string;
}

export type UserTokenProps = {
    status: string;
    token: string;
    signin_user_id: string;
}

export type UploadResult = {
    file_name: string;
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