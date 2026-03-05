import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import FavoritedFiles from "./pages/FavoritedFiles";
import AddFiles from "./pages/AddFiles";
import Profile from "./pages/Profile";
import Folders from "./pages/Folders";
import Files from "./pages/Files";
import FavoritedFolders from "./pages/FavoritedFolders";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                    <Route path='/profile/:user_id' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                    <Route path='/home/:user_id' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                    <Route path='/favorited-files/:user_id' element={<ProtectedRoute><FavoritedFiles/></ProtectedRoute>}/>
                    <Route path='/favorited-folders/:user_id' element={<ProtectedRoute><FavoritedFolders/></ProtectedRoute>}/>
                    <Route path='/folders/:user_id' element={<ProtectedRoute><Folders/></ProtectedRoute>}/>
                    <Route path='/folder-files/:folder_name' element={<ProtectedRoute><Files/></ProtectedRoute>}/>
                    <Route path='/add-file' element={<ProtectedRoute><AddFiles/></ProtectedRoute>}/>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}