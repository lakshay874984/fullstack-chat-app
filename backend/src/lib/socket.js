import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // your frontend
    }
});
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        io.emit("getOlineUsers", Object.keys(userSocketMap)); 
        console.log("User connected: " + userId);
    }
    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
        delete userSocketMap[userId];
        io.emit("getOlineUsers", Object.keys(userSocketMap));

    }
    );
});

export {io,app, server};