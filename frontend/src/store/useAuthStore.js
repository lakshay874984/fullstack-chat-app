import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';


export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoginningIn: false,
    idUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers : [],
    socket : null,
    checkAuth : async () => {
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser : res.data})
            get().connectSocket();
        }
        catch(err){
            console.log("Auth check failed", err);
            set({authUser : null});

        }
        finally{
            set({isCheckingAuth : false});
        }
},
    signup : async (data) => {
        set({isSigningUp : true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser : res.data});
            toast.success("Signup successful!");
            get().connectSocket();
        }
        catch(err){
            console.log("Signup failed", err.response);
            toast.error(err?.response?.data?.message || "Signup failed. Please try again.");
        }
        finally{
            set({isSigningUp : false});
        }
    
        
    },

logout : async () => { 
    try{
        await axiosInstance.post("/auth/logout");
        set({authUser : null});
        toast.success("Logged out successfully");
        get().disconnectSocket();
    }
    catch(err){
        console.log("Logout failed", err);
        toast.error("Logout failed. Please try again.");
    }},


   login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();

      get().connectSocket();
    } catch (error) {
        console.log("Login failed", error.response);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    }
    catch (err) {
        console.log("Profile update failed", err.response);
        toast.error(err?.response?.data?.message || "Profile update failed. Please try again.");
    } finally {
        set({ isUpdatingProfile: false });
    }
    },  
    connectSocket: () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query: { userId: authUser._id }
        });
        socket.connect();
        set({socket : socket});
        socket.on("getOlineUsers", (userIds) => {
            set({onlineUsers : userIds});
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
        

}) );

 