import { Link } from "react-router-dom";
import useAuth from "../services/useAuth";

export function Navbar1() {
    const { username, signOut } = useAuth();

    return (
        <nav className="md:w-1/4 md:flex flex-col gap-[1rem] p-[1rem] hidden shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white">
            <div className="text-gray-700 font-[500] text-[1rem]">{username}</div>
            <Link to={'/home'} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center">
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
            </Link>
            <Link to={'/favorite'} className="text-gray-700 font-[500] text-[1rem] flex gap-[0.7rem] items-center">
                <i className="fa-solid fa-star"></i>
                <span>Favorite</span>
            </Link>
            <button onClick={async () => await signOut()} className="cursor-pointer flex gap-[0.7rem] items-center text-gray-700 font-[500] text-[1rem] text-left">
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}

export function Navbar2() {
    const { signOut, username } = useAuth();
    return (
        <div className="md:hidden flex justify-center gap-[1rem] shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white p-[1rem]">
            <Link to={'/home'} className="text-gray-700 font-[500] text-[1rem]">
                <i className="fa-solid fa-house"></i>
            </Link>
            <Link to={'/favorite'} className="text-gray-700 font-[500] text-[1rem]">
                <i className="fa-solid fa-star"></i>
            </Link>
            <div className="text-gray-700 font-[500] text-[1rem]">{username[0]}</div>
            <button onClick={async () => await signOut()} className="cursor-pointer text-gray-700 font-[500] text-[1rem]">
                <i className="fa-solid fa-door-open"></i>
            </button>
        </div>
    )
}