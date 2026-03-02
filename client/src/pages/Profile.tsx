import { useParams } from "react-router-dom";
import type { CurrentUserIntrf } from "../models/userModel";
import DataModifier from "../services/dataService"
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";

export default function Profile() {
    const { user_id } = useParams();
    const { getData } = DataModifier();
    const { data: currentUserData, isLoading, error } = getData<CurrentUserIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/api/users/user-data`,
        query_key: [`current-user-${user_id}`],
        stale_time: 600000,
    });

    return (
        <div className="h-screen flex md:flex-row flex-col gap-4 p-4">
            <Navbar1/>
            <Navbar2/>
            {isLoading ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <Loading/>
                </div>
            ) : error ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <p className="text-blue-300 font-medium text-[1rem]">{error.message}</p>
                </div>
            ) : (
                <div className="p-4 md:w-3/4 w-full">
                    <span>{currentUserData?.user_id}</span>
                    <span>{currentUserData?.email}</span>
                    <span>{currentUserData?.username}</span>
                </div>
            )}
        </div>
    );
}