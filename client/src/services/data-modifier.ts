import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import type { ChangeDataProps, GetDataProps, InfiniteScrollProps, InputDataProps } from "./custom-types";

export default function DataModifier() {
    const { user } = useAuth();
    const token = user ? user.token : '';

    const changeData = async <S>(props: ChangeDataProps<S>) => {
        const request = await fetch(props.api_url, {
            body: JSON.stringify(props.data),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        await request.json();
    }

    const deleteData = async (api_url: string) => {
        const request = await fetch(api_url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        await request.json();
    }

    const getData = async <V>(props: GetDataProps) => {
        const { data, error, isLoading } = useQuery<V, Error>({
            gcTime: 480000,
            queryFn: async () => {
                const request = await fetch(props.api_url, {
                    headers: { 
                        'Authentication': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                    method: 'GET'
                });

                const response = await request.json();
                return response;
            },
            queryKey: props.query_key,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time,
        });

        return { data, error, isLoading }
    }

    const infiniteScroll = <X>(props: InfiniteScrollProps) => {
        const fetchers = async ({ pageParam = 1 }: { pageParam?: number }) => {
            const request = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET'
            });

            const response = await request.json();
            return response;
        }

        const { 
            data, 
            error, 
            fetchNextPage, 
            hasNextPage, 
            isFetchingNextPage, 
            isLoading 
        } = useInfiniteQuery({
            gcTime: 480000,
            getNextPageParam: (lastPage, allPages): number | undefined => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            initialPageParam: 1,
            queryFn: fetchers,
            queryKey: props.query_key,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time
        });

        const paginatedData: X[] = data ? data.pages.flat() : [];
        const isReachedEnd = !hasNextPage;

        return { error, fetchNextPage, isFetchingNextPage, isReachedEnd, isLoading, paginatedData }
    }

    const insertData = async <S>(props: InputDataProps<S>) => {
        const request = await fetch(props.api_url, {
            body: JSON.stringify(props.data),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        await request.json();
    }

    return { changeData, deleteData, getData, infiniteScroll, insertData }
};