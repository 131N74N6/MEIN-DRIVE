import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import useAuth from "../services/auth.service";
import Loading from "./Loading";

type ProtectedRouteProps = {
    children: ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
    const { userLoading, currentUserId } = useAuth();

    if (userLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#1a1a1a]">
                <Loading/>
            </div>
        );
    }

    if (!currentUserId) {
        return <Navigate to={'/sign-in'} replace/>;
    }

    return currentUserId ? <>{props.children}</> : <Navigate to={'/sign-in'} replace/>;
}