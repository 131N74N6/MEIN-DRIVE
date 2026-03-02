export type CurrentUserTokenIntrf = {
    status: string;
    token: string;
    user_id: string;
}

export type CurrentUserIntrf = {
    created_at: string;
    email: string;
    user_id: string;
    username: string;
}

export type SignUpProps = {
    created_at: string;
    email: string;
    password: string;
    username: string;
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