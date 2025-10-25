import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import type { GetDataProps } from "./custom-types";

export default function DataModifier() {
    const { user } = useAuth();
    const token = user ? user.token : '';

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

    const infiniteScroll = async () => {}

    return { deleteData, getData, infiniteScroll }
};