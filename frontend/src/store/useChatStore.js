import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
   sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
    
      set({ messages: [...messages, res.data] });
     
    } catch (error) {
  const message =
    error?.response?.data?.message || "Something went wrong";
  toast.error(message);
}

  },
subscribeToNewMessages: (userId) => {
  const socket = useAuthStore.getState().socket;

  socket.on("newMessage", (newMessage) => {
    if (newMessage.senderId !== selectedUser._id) return;
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  });
}

  ,
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
   setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
 