import { useParams } from "react-router-dom";
import type { CurrentUserIntrf } from "../models/userModel";
import DataModifier from "../services/dataService"
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";

export default function Profile() {
    const { user_id } = useParams();
    const { getData } = DataModifier();
    const { data: currentUserData, isLoading, error } = getData<CurrentUserIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/users/user-data/${user_id}`,
        query_key: [`current-user-${user_id}`],
        stale_time: 1200000,
    });

    return (
        <div className="h-screen flex md:flex-row flex-col gap-4 p-4">
            {isLoading ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <Loading/>
                </div>
            ) : error ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <p className="text-blue-300 font-medium text-[1rem]">{error.message}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white p-4">
                    <span className="font-medium text-lg">user id: {currentUserData?.user_id}</span>
                    <span className="font-medium text-lg">email: {currentUserData?.email}</span>
                    <span className="font-medium text-lg">username: {currentUserData?.username}</span>
                    <span className="font-medium text-lg">created at: {currentUserData ? new Date(currentUserData.created_at).toLocaleString() : '-'}</span>
                </div>
            )}
            <Navbar1/>
            <Navbar2/>
        </div>
    );
}