import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Favorited from "./pages/Favorited";
import AddFiles from "./pages/AddFiles";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                    <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                    <Route path='/favorite' element={<ProtectedRoute><Favorited/></ProtectedRoute>}/>
                    <Route path='/add-file' element={<ProtectedRoute><AddFiles/></ProtectedRoute>}/>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}