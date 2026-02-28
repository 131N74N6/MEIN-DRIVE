import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataModifier from "../services/dataService";

export function deleteOneFileController(id: string) {
    const { deleteData, setMessage } = DataModifier();
    const queryClient = useQueryClient();
    
    const deleteFileMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_API_BASE_URL}/files/erase/${id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete or chech your internet connection.');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-files-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`is-favorited-${[currentUserId]}`] });
            queryClient.invalidateQueries({ queryKey: [`all-favorited-files-${currentUserId}`] });
        }
    });

    deleteFileMutation.mutate(id);
}