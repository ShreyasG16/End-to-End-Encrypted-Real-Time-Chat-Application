import React, { useEffect } from 'react'
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import {Routes,Route, Navigate} from "react-router-dom";
import { axiosInstance } from './lib/axios';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"

const App = () => {
    const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
    const {theme}=useThemeStore();

    console.log({onlineUsers});
     
    useEffect(() => {
      checkAuth()
    }, [checkAuth]);

    console.log({authUser});

    if(isCheckingAuth && !authUser) 
    {
       return (
         <div className="flex items-center justify-center h-screen bg-black">
            <div className="flex flex-col items-center space-y-2">
               <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
               🔒ChatSecure 💬
               </h1>
               <div className="flex space-x-1">
               <span className="w-2 h-4 bg-red-500 rounded-full animate-bounce"></span>
               <span className="w-2 h-4 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
               <span className="w-2 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
               <span className="w-2 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
               </div>
            </div>
         </div>
         );
    }

    return (
       <div data-theme={theme}>
        <Navbar/>
        <Routes>
           <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
           <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/> } />
           <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/> } />
           <Route path="/settings" element={<SettingsPage/>} />
           <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
        </Routes>

        <Toaster/>
       </div>
    );
};

export default App