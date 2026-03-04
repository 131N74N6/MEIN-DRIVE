import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
    const navigate = useNavigate();
    const { currentUserId, setUserError, userError, userLoading, signIn } = useAuth();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (currentUserId) navigate(`/home/${currentUserId}`);
    }, [currentUserId, navigate]);

    useEffect(() => {
        if (userError) {
            const timer = setTimeout(() => setUserError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [userError, setUserError]);

    async function signInButton(event: React.FormEvent) {
        event.preventDefault();
        await signIn(email.trim(), password.trim(), navigate);
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <section className="flex justify-center items-center h-screen bg-white p-2">
            <form onSubmit={signInButton} className="bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)] p-4 w-120 rounded-md flex flex-col gap-4">
                <h3 className="text-gray-900 font-[500] text-[1.3rem] text-center">Welcome</h3>
                <div className="flex flex-col gap-2">
                    <label htmlFor="your-email" className="text-gray-900">Email</label>
                    <input type="email" 
                        value={email}
                        placeholder="email"
                        id="your-email"
                        className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black pr-10"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="your-password" className="text-gray-900">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            placeholder="password"
                            id="your-password"
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black pr-10"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-gray-600 hover:text-black"
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <p className="text-center text-gray-800">Don't have account? <Link className="text-blue-500" to={'/sign-up'}>Sign Up</Link></p>
                <button 
                    type="submit" 
                    disabled={userLoading}
                    className="bg-gray-700 rounded-md cursor-pointer text-white font-[500] text-[0.9rem] p-[0.4rem] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
                >
                    Sign In
                </button>
                {userError ? <p className="text-red-400 font-medium text-center">{userError}</p> : null}
            </form>
        </section>
    );
}