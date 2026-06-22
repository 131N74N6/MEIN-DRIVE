import { useNavigate } from "react-router-dom";
import useAuth from "../services/auth.service";
import { CircleUser, DoorOpen, File, FilePlusCorner, Folder, Heart, Home } from "lucide-react";

export function Navbar1(is_processing?: boolean) {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="md:w-1/4 md:flex flex-col gap-[1rem] rounded p-[1rem] hidden shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white">
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/profile')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer disabled:cursor-not-allowed"
            >
                <CircleUser></CircleUser>
                <span>Your Profile</span>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/add-file')} className="cursor-pointer text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center disabled:cursor-not-allowed"
            >
                <FilePlusCorner></FilePlusCorner>
                <span>Add Files</span>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/home')} className="cursor-pointer text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center disabled:cursor-not-allowed"
            >
                <Home></Home>
                <span>Home</span>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/folders')} className="cursor-pointer text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center disabled:cursor-not-allowed"
            >
                <Folder></Folder>
                <span>Folder</span>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/files')} className="cursor-pointer text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center disabled:cursor-not-allowed"
            >
                <File></File>
                <span>File</span>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/favorited')} className="cursor-pointer text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center disabled:cursor-not-allowed"
            >
                <Heart></Heart>
                <span>Favorited</span>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={signOut} className="cursor-pointer flex gap-[0.7rem] items-center text-gray-700 font-[500] text-[1rem] text-left disabled:cursor-not-allowed"
            >
                <DoorOpen></DoorOpen>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}

export function Navbar2(is_processing?: boolean) {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="md:hidden flex justify-center rounded gap-[1rem] shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white p-[1rem]">
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/profile')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer disabled:cursor-not-allowed"
            >
                <CircleUser></CircleUser>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/add-file')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer items-center disabled:cursor-not-allowed"
            >
                <FilePlusCorner></FilePlusCorner>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/home')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer items-center disabled:cursor-not-allowed"
            >
                <Home></Home>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/folders')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer items-center disabled:cursor-not-allowed"
            >
                <Folder></Folder>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/files')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer items-center disabled:cursor-not-allowed"
            >
                <File></File>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={() => navigate('/favorited')} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] cursor-pointer items-center disabled:cursor-not-allowed"
            >
                <Heart></Heart>
            </button>
            <button 
                type="button" 
                disabled={is_processing} 
                onClick={signOut} className="cursor-pointer flex gap-[0.7rem] items-center text-gray-700 font-[500] text-[1rem] text-left disabled:cursor-not-allowed"
            >
                <DoorOpen></DoorOpen>
            </button>
        </nav>
    )
}