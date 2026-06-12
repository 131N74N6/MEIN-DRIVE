import { useParams } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import UserServices from "../services/user.service";
import { useEffect } from "react";

export default function Profile() {
    const { user_id } = useParams();
    const { 
        changeProfileMt, deleteAccountMt, editMode, handleInputChange, isProcessing, message,
        newProfile, setEditMode, setMessage, setNewProfile, userData, userLoading, userError 
    } = UserServices(user_id!);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    function cancelEditProfile() {
        setEditMode(false);
        setNewProfile({ email: '', username: '' });
    }

    function applyEditedProfile(event: React.FormEvent) {
        event.preventDefault();
        changeProfileMt.mutate();
    }

    return (
        <div className="h-screen flex md:flex-row flex-col gap-4 p-4">
            {userLoading ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <Loading/>
                </div>
            ) : userError ? (
                <div className="flex w-full md:w-3/4 h-full justify-center items-center">
                    <p className="text-blue-300 font-medium text-[1rem]">{userError.message}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 md:w-3/4 h-[100%] min-h-[200px] w-full rounded shadow-[0_0_4px_#1a1a1a] bg-white p-4">
                    <span className="font-medium md:text-lg text-base">user id: {userData?.user_id}</span>
                    {editMode ? (
                        <form className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <label className="font-medium md:text-md text-base" htmlFor="new_email">email: </label>
                                <input 
                                    type="text" 
                                    name="email"
                                    id="new_email"
                                    value={newProfile.email}
                                    className="border border-gray-600 text-black text-base md:text-md p-1.5 outline-0 w-full font-medium"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label className="font-medium md:text-md text-base" htmlFor="new_name">username: </label>
                                <input 
                                    type="text"
                                    name="username"
                                    id="new_name"
                                    value={newProfile.username}
                                    className="border border-gray-600 text-black text-base md:text-md p-1.5 outline-0 w-full font-medium"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    ) : (
                        <>
                            <span className="font-medium md:text-lg text-base">email: {userData?.email}</span>
                            <span className="font-medium md:text-lg text-base">username: {userData?.username}</span>
                        </>
                    )}
                    <span className="font-medium md:text-lg text-base">created at: {userData ? new Date(userData.created_at).toLocaleString() : '-'}</span>
                    {editMode ? (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                disabled={isProcessing} 
                                onClick={cancelEditProfile}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isProcessing} 
                                onClick={applyEditedProfile}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing' : 'Save'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                disabled={isProcessing} 
                                onClick={() => setEditMode(true)}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Edit Profile
                            </button>
                            <button 
                                type="button" 
                                disabled={isProcessing} 
                                onClick={() => deleteAccountMt.mutate()}
                                className="text-base md:text-md text-white p-2 rounded-md font-medium bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing' : 'Delete This Account'}
                            </button>
                        </div>
                    )}
                    {message ? <div className="text-center text-gray-700 text-2xl font-medium">{message}</div> : null}
                </div>
            )}
            <Navbar1/>
            <Navbar2/>
        </div>
    );
}