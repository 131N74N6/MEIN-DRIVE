export type ChangeDataProps<A> = {
    api_url: string;
    data: Partial<Omit<A, '_id'>>;
}

export type DeleteDataProps = {
    api_url: string;
}

export type GetDataProps = {
    api_url: string;
    stale_time: number;
    query_key: string[];
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