import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { connectSocket, getSocket, disconnectSocket as libDisconnectSocket, setOnlineUsersCallback } from "../lib/socket.js";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;

    // Set up callback FIRST, before connecting socket
    // This ensures we catch the event even if socket connects immediately
    setOnlineUsersCallback((userIds) => {
      console.log("Updating online users via callback:", userIds);
      set({ onlineUsers: userIds });
    });

    // Use the shared socket from lib/socket.js
    const socket = connectSocket(authUser._id);
    if (!socket) return;

    set({ socket: socket });

    // Also set up direct listener as backup
    socket.off("getOnlineUsers");
    socket.on("getOnlineUsers", (userIds) => {
      console.log("Updating online users via direct listener:", userIds);
      set({ onlineUsers: userIds });
    });

    // If socket is already connected, we might have missed the initial event
    // The backend will emit it again on the next connection, but we can also
    // wait for it or the backend should re-emit periodically
    if (socket.connected) {
      console.log("Socket already connected, online users should be received on next update");
    }

    console.log("Socket connection setup complete, connected:", socket.connected);
  },
  disconnectSocket: () => {
    libDisconnectSocket();
    set({ socket: null });
  },
}));
