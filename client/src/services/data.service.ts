import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ChangeDataProps, DeleteDataProps, GetDataProps, InfiniteScrollProps, InputDataProps } from "./type.service";
import useAuth from "./auth.service";

export default function DataModifier() {
    const { loading, token } = useAuth();
    const currentUserToken = token ? token : '';

    const changeData = async <S>(props: ChangeDataProps<S>) => {
        const request = await fetch(props.api_url, {
            body: JSON.stringify(props.data),
            headers: {
                'Authorization': `Bearer ${currentUserToken}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        await request.json();
    }

    const deleteData = async (props: DeleteDataProps) => {
        const request = await fetch(props.api_url, {
            headers: {
                'Authorization': `Bearer ${currentUserToken}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        await request.json();
    }

    function getData<BIN1999>(props: GetDataProps) {
        const { data, error, isLoading } = useQuery<BIN1999, Error>({
            enabled: !!token && !loading,
            queryFn: async () => {
                const request = await fetch(props.api_url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
            staleTime: props.stale_time
        });

        return { data, error, isLoading }
    }

    const infiniteScroll = <X>(props: InfiniteScrollProps) => {
        const fetchers = async ({ pageParam = 1 }: { pageParam?: number }) => {
            if (props.searched === undefined) {
                const request1 = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
                    headers: {
                        'Authorization': `Bearer ${currentUserToken}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                });

                const response = await request1.json();
                console.log(currentUserToken);
                return response;
            } else {
                const request2 = await fetch(`${props.api_url}?search=${props.searched}&page=${pageParam}&limit=${props.limit}`, {
                    headers: {
                        'Authorization': `Bearer ${currentUserToken}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                });
                
                const response = await request2.json();
                console.log(currentUserToken);
                return response;
            }
        }

        const { 
            data, 
            error, 
            fetchNextPage, 
            hasNextPage, 
            isFetchingNextPage, 
            isLoading 
        } = useInfiniteQuery({
            enabled: !!currentUserToken && !loading,
            gcTime: 600000,
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
                'Authorization': `Bearer ${currentUserToken}`,
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        await request.json();
    }

    return { changeData, deleteData, getData, infiniteScroll, insertData }
};