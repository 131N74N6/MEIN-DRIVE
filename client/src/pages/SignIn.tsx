import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";
import Loading from "../components/Loading";

export default function SignIn() {
    const { loading, currentUserId, signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    useEffect(() => {
        if (currentUserId && !loading) navigate('/home', { replace: true });
    }, [loading, currentUserId, navigate]);

    const signInButton = async (event: React.FormEvent) => {
        event.preventDefault();
        await signIn(email, password);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen bg-purple-950">
            <form onSubmit={signInButton} className="bg-purple-950 border border-purple-300 p-[1rem] w-[300px] flex flex-col gap-[1rem]">
                <h3 className="text-purple-400 font-[500] text-[1.3rem] text-center">Welcome</h3>
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
                <p className="text-center text-white">Don't have account? <Link className="text-purple-400" to={'/sign-up'}>Sign Up</Link></p>
                <button type="submit" className="bg-purple-400 cursor-pointer text-purple-950 font-[500] text-[0.9rem] p-[0.4rem]">Sign In</button>
            </form>
        </div>
    );
}