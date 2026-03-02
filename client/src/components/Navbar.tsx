import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/authService";
import { CircleUser, DoorOpen, FileHeart, FilePlusCorner, Home } from "lucide-react";

export function Navbar1() {
    const { currentUserId, signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="md:w-1/4 md:flex flex-col gap-[1rem] rounded p-[1rem] hidden shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white">
            <div className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem]" onClick={() => navigate(`/profile/${currentUserId}`)}>
                <CircleUser></CircleUser>
                <span>Your Profile</span>
            </div>
            <Link to={'/add-file'} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center">
                <FilePlusCorner></FilePlusCorner>
                <span>Add Files</span>
            </Link>
            <Link to={'/home'} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center">
                <Home></Home>
                <span>Home</span>
            </Link>
            <Link to={'/favorite'} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center">
                <FileHeart></FileHeart>
                <span>Favorite Files</span>
            </Link>
            <button onClick={signOut} className="cursor-pointer flex gap-[0.7rem] items-center text-gray-700 font-[500] text-[1rem] text-left">
                <DoorOpen></DoorOpen>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}

export function Navbar2() {
    const { signOut, currentUserId } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="md:hidden flex justify-center rounded gap-[1rem] shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white p-[1rem]">
            <Link to={'/home'} className="text-gray-700 font-[500] text-[1rem]">
                <Home></Home>
            </Link>
            <Link to={'/favorite'} className="text-gray-700 font-[500] text-[1rem]">
                <FileHeart></FileHeart>
            </Link>
            <Link to={'/add-file'} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center">
                <FilePlusCorner></FilePlusCorner>
            </Link>
            <div className="text-gray-700 font-[500] text-[1rem]" onClick={() => navigate(`/profile/${currentUserId}`)}>
                <CircleUser></CircleUser>
            </div>
            <button onClick={signOut} className="cursor-pointer text-gray-700 font-[500] text-[1rem]">
                <DoorOpen></DoorOpen>
            </button>
        </nav>
    )
}