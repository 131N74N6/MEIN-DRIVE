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