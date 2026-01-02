import { io } from "socket.io-client";

let socket = null;
let onlineUsersCallback = null;

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : undefined; // same origin in production

export const setOnlineUsersCallback = (callback) => {
  onlineUsersCallback = callback;
  // If socket is already connected and we have a callback, we might have missed the initial event
  // So we can't do anything about it here, but future events will be caught
};

export const connectSocket = (userId) => {
  if (!userId) return null;

  // If socket exists and is connected with the same user, return it
  if (socket && socket.connected) {
    const currentUserId = socket.io.opts.query?.userId;
    if (currentUserId === userId) {
      return socket;
    }
    // Different user, disconnect old socket
    socket.disconnect();
    socket = null;
  }

  // If socket exists but not connected, clean it up
  if (socket && !socket.connected) {
    socket.removeAllListeners();
    socket = null;
  }

  // Create new socket connection
  socket = io(SOCKET_URL, {
    query: { userId },
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Set up getOnlineUsers listener IMMEDIATELY (before connection)
  // This ensures we catch the event even if socket connects very quickly
  socket.on("getOnlineUsers", (userIds) => {
    console.log("getOnlineUsers event received in lib/socket.js:", userIds);
    // Call the callback if it's set (from useAuthStore)
    if (onlineUsersCallback) {
      onlineUsersCallback(userIds);
    }
  });

  // Log connection events for debugging (only set once)
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("Socket reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log("Socket reconnection attempt", attemptNumber);
  });

  socket.on("reconnect_error", (error) => {
    console.error("Socket reconnection error:", error.message);
  });

  socket.on("reconnect_failed", () => {
    console.error("Socket reconnection failed");
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
