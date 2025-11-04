import { Link } from "react-router-dom";

export function Navbar1() {
    return (
        <nav className="md:w-1/4 md:flex flex-col gap-[1rem] p-[1rem] hidden shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white">
            <Link to={'/home'} className="text-gray-700 font-[500] text-[1rem]">
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
            </Link>
        </nav>
    );
}

export function Navbar2() {
    return (
        <div className="md:hidden flex justify-center gap-[1rem] shrink-0 shadow-[0_0_4px_#1a1a1a] bg-white p-[1rem]">
            <Link to={'/home'} className="text-gray-700 font-[500] text-[1rem]">
                <i className="fa-solid fa-house"></i>
            </Link>
        </div>
    )
}