import { Navbar1, Navbar2 } from "../components/Navbar";

export default function Files() {
    return (
        <div className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-purple-950">
            <Navbar2/>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[1rem] p-[1rem] border border-purple-400 rounded"></div>
            <Navbar1/>
        </div>
    );
}