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

export type GetCurrentUserProps = {
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

export type UserTokenProps = {
    status: string;
    user_id: string;
    token: string;
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