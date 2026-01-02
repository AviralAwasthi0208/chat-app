import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? true // allow same-origin in production
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// userId -> socketId
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User connected:", socket.id, "userId:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 📞 OUTGOING CALL
  socket.on("outgoing-call", ({ toUserId, offer, callType, callerName }) => {
    const receiverSocketId = getReceiverSocketId(toUserId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        fromUserId: userId,
        offer,
        callType,
        callerName,
      });
    }
  });

  // ✅ CALL ACCEPTED
  socket.on("call-accepted", ({ toUserId, answer }) => {
    const receiverSocketId = getReceiverSocketId(toUserId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-accepted", { answer });
    }
  });

  // ❄ ICE CANDIDATE
  socket.on("ice-candidate", ({ toUserId, candidate }) => {
    const receiverSocketId = getReceiverSocketId(toUserId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", { candidate });
    }
  });

  // ❌ END CALL
  socket.on("call-ended", ({ toUserId }) => {
    const receiverSocketId = getReceiverSocketId(toUserId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // clean up by socketId
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
