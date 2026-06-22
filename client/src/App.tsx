import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AddFiles from "./pages/AddFiles";
import Profile from "./pages/Profile";
import Folders from "./pages/Folders";
import FolderContents from "./pages/FolderContents";
import FileDetail from "./pages/FileDetail";
import Favorited from "./pages/Favorited";
import Files from "./pages/Files";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route path='/add-file' element={<ProtectedRoute><AddFiles/></ProtectedRoute>}/>
                    <Route path='/favorited' element={<ProtectedRoute><Favorited/></ProtectedRoute>}/>
                    <Route path='/files' element={<ProtectedRoute><Files/></ProtectedRoute>}/>
                    <Route path='/folders' element={<ProtectedRoute><Folders/></ProtectedRoute>}/>
                    <Route path='/folder-content/branch/:folder_id' element={<ProtectedRoute><FolderContents/></ProtectedRoute>}/>
                    <Route path='/folder-content/:folder_id' element={<ProtectedRoute><FolderContents/></ProtectedRoute>}/>
                    <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                    <Route path='/file/:id' element={<ProtectedRoute><FileDetail/></ProtectedRoute>}/>
                    <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}