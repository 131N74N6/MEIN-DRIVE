import { Navigate } from "react-router-dom";
import type { ProtectedRouteProps } from "../services/custom-types";
import useAuth from "../services/useAuth";

export default function ProtectedRoute(props: ProtectedRouteProps) {
    const { loading, currentUserId } = useAuth();

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-[#1a1a1a]">
            <div className="animate-spin rounded w-[48px] h-[48px] border-purple-400"></div>
        </div>
    );

    return currentUserId ? <>{props.children}</> : <Navigate to={'/sign-in'} replace/>
}