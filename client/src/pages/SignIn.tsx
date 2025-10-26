import { useState } from "react";

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const signInButton = async () => {}

    return (
        <div className="flex justify-center items-center h-screen bg-purple-950">
            <form onSubmit={signInButton} className="bg-purple-950 border border-purple-300 p-[1rem] w-[200px] h-[400px] flex flex-col gap-[1.3rem]">
                <div className="flex flex-col gap-[1rem]">
                    <label htmlFor="your-email" className="text-purple-400">Email</label>
                    <input type="email" 
                        value={email}
                        placeholder="email"
                        id="your-email"
                        className="border border-purple-400 text-purple-400 font-[500] text-[0.9rem] p-[0.4rem] outline-0"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label htmlFor="your-password" className="text-purple-400">Password</label>
                    <input type="password" 
                        value={password}
                        placeholder="password"
                        id="your-password"
                        className="border border-purple-400 text-purple-400 font-[500] text-[0.9rem] p-[0.4rem] outline-0"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit" className="bg-purple-400 text-purple-950 font-[500] text-[0.9rem] p-[0.4rem]">Sign In</button>
            </form>
        </div>
    );
}