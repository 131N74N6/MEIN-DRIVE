import { useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import AddFiles from "../components/AddFiles";

export default function Home() {
    const [openUploader, setOpemUploader] = useState<boolean>(false);
    return (
        <div className="flex md:flex-row flex-col h-screen gap-[1rem] p-[1rem] bg-purple-950">
            {openUploader ? <AddFiles setOpenUploader={setOpemUploader}/> : null}
            <Navbar2/>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[1rem] p-[1rem] border border-purple-400 rounded">
                <button onClick={() => setOpemUploader(true)}></button>
            </div>
            <Navbar1/>
        </div>
    );
}