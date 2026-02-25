import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/auth.service";
import Loading from "../components/Loading";

export default function SignUp() {
    const { dispatch, loading, currentUserId, signUp, state } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        if (currentUserId && !loading) navigate('/home', { replace:true });
    }, [loading, navigate, currentUserId]);

    useEffect(() => {
        if (state.error) {
            const timer = setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 3000);
            return () => clearTimeout(timer);
        }
    }, [state.error]);

    const signUpButton = async (event: React.FormEvent) => {
        event.preventDefault();

        await signUp({ 
            created_at: new Date().toISOString(), 
            email: email, 
            password: password, 
            username: username 
        });
    }
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    return (
        <section className="flex justify-center items-center h-screen bg-purple-950">
            <form onSubmit={signUpButton} className="bg-purple-950 border border-purple-300 p-[1rem] w-[300px] flex flex-col gap-[1rem]">
                <h3 className="text-purple-400 font-[500] text-[1.3rem] text-center">Hello</h3>
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
                <div className="flex flex-col gap-[1rem]">
                    <label htmlFor="your-username" className="text-purple-400">Username</label>
                    <input type="text" 
                        value={username}
                        placeholder="username"
                        id="your-username"
                        className="border border-purple-400 text-purple-400 font-[500] text-[0.9rem] p-[0.4rem] outline-0"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    />
                </div>
                <p className="text-center text-white">Already have account? <Link className="text-purple-400" to={'/sign-in'}>Sign In</Link></p>
                <button type="submit" className="bg-purple-400 text-purple-950 cursor-pointer font-[500] text-[0.9rem] p-[0.4rem]">Sign Up</button>
                {state.error ? <p className="text-amber-300 font-medium text-center">{state.error}</p> : null}
            </form>
        </section>
    );
}