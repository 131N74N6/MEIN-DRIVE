export default function SignUp() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex">
                <div className="bg-red-700 text-white font-[500] p-[1rem] w-[200px] h-[400px]"></div>
                <form className="bg-white shadow-[0_0_4px_#1a1a1a] p-[1rem] w-[200px] h-[400px] flex flex-col gap-[1.3rem]">
                    <input type="text" />
                    <input type="text" />
                    <button type="submit" className="bg-pink-800 text-white font-[500] text-[0.9rem] p-[0.4rem]">Sign In</button>
                </form>
            </div>
        </div>
    )
}