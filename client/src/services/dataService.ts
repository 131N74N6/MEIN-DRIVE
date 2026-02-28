import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ChangeDataProps, DeleteDataProps, GetDataProps, InfiniteScrollProps, InputDataProps } from "../models/dataModel";
import useAuth from "./authService";

export default function DataModifier() {
    const { loading, token } = useAuth();
    const currentUserToken = token ? token : '';
    const [message, setMessage] = useState<string | null>(null);

    async function changeData<R>(props: ChangeDataProps<R>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
            });

            const response = await request.json();

            if (!request.ok) {
                setMessage(response.message);
                throw new Error(response.message);
            } else {
                setMessage(null);
                return response;
            }
        } catch (error: any) {
            setMessage(error.message || 'Check Your Network Connection');
            throw error;
        }
    }

    async function deleteData(props: DeleteDataProps) {
        try {
            const request = await fetch(props.api_url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });

            const response = await request.json();

            if (!request.ok) {
                setMessage(response.message);
                throw new Error(response.message);
            } else {
                setMessage(null);
                return response;
            }
        } catch (error: any) {
            setMessage(error.message || 'Check Your Network Connection');
            throw error;
        }
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

    async function insertData<R>(props: InputDataProps<R>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
            });

            const response = await request.json();
            
            if (!request.ok) {
                setMessage(response.message);
                throw new Error(response.message);
            } else {
                setMessage(null);
                return response;
            }
        } catch (error: any) {
            setMessage(error.message || 'Check Your Network Connection');
            throw error;
        }
    }

    return { changeData, deleteData, getData, infiniteScroll, insertData, message, setMessage }
};