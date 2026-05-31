import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ChangeDataProps, DeleteDataProps, GetDataProps, InfiniteScrollProps, InputDataProps } from "../models/dataModel";
import useAuth from "./auth_service";

export default function DataModifier() {
    const { currentUserId, userLoading } = useAuth();
    const [message, setMessage] = useState<string | null>(null);

    async function changeData<R>(props: ChangeDataProps<R>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
            });

            const response = await request.json();

            if (!request.ok) {
                throw new Error(response.message);
            } else {
                return response;
            }
        } catch (error: any) {
            throw error;
        }
    }

    async function deleteData(props: DeleteDataProps) {
        try {
            const request = await fetch(props.api_url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });

            const response = await request.json();

            if (!request.ok) {
                throw new Error(response.message);
            } else {
                return response;
            }
        } catch (error: any) {
            throw error;
        }
    }

    function getData<X>(props: GetDataProps) {
        const { data, error, isLoading } = useQuery<X, Error>({
            enabled: !!currentUserId && !userLoading,
            queryFn: async () => {
                try {
                    const request = await fetch(props.api_url, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'GET'
                    });

                    const response = await request.json();

                    if (!request.ok) {
                        throw new Error(response.message);
                    } else {
                        return response;
                    }
                } catch (error: any) {
                    throw error;
                }
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
        const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
            enabled: !userLoading && !!currentUserId,
            getNextPageParam: (lastPage, allPages): number | undefined => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                try {
                    const baseUrl = `${props.api_url}?page=${pageParam}&limit=${props.limit}`;
                    const finalUrl = props.searched ? `${baseUrl}&search=${props.searched.trim()}` : baseUrl;

                    const request = await fetch(finalUrl, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'GET'
                    });

                    const response = await request.json();

                    if (!request.ok) {
                        throw new Error(response.message);
                    } else {
                        return response;
                    }
                } catch (error: any) {
                    throw error;
                }
            },
            queryKey: props.query_key,
            initialPageParam: 1,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time,
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
                    'Content-Type': 'application/json'
                },
                method: 'POST',
            });

            const response = await request.json();
            
            if (!request.ok) {
                throw new Error(response.message);
            } else {
                return response;
            }
        } catch (error: any) {
            throw error;
        }
    }

    return { changeData, deleteData, getData, infiniteScroll, insertData, message, setMessage }
};