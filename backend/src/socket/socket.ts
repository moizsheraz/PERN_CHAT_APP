import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const userSocketMap: { [key: string]: string } = {};
const usernametoSocketIdMap = new Map();
const socketIdToUsernameMap = new Map();

export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId as string;

    if (userId) {
        userSocketMap[userId] = socket.id
    }
    // io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on('videocall:req', ({ to, from, message, roomId }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('videocall:req', { from, message, roomId });
        }
    });

    socket.on("room:join", (data) => {
        const { authUserName, roomId } = data;
        console.log("user joined room", authUserName, roomId);
        usernametoSocketIdMap.set(authUserName, socket.id);
        socketIdToUsernameMap.set(socket.id, authUserName);
        io.to(roomId).emit("user:joined", {
            authUserName, socketId: socket.id,
        });
        socket.join(roomId);
        socket.emit("room:join", { authUserName, roomId });
    });

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomingCall", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, answer }) => {
        io.to(to).emit("call:accepted", { from: socket.id, answer });
        console.log("call:accepted", answer);
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
    
      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
    

});

export { io, server, app };
