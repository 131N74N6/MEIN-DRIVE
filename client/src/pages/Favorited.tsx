import { Navbar1, Navbar2 } from "../components/Navbar";

export default function Favorited() {
    return (
        <div className="flex gap-[1rem] md:flex-row flex-col h-screen">
            <Navbar1/>
            <Navbar2/>
        </div>
    );
}