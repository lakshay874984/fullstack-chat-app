import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import {app, server} from './lib/socket.js';
import path from 'path';




import dotenv from 'dotenv';
dotenv.config();


import authRoutes from "./routes/auth.rote.js" 
// Import the auth routes
import messageRoutes from "./routes/message.route.js"
 
import { connectDB } from './lib/db.js';





const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
app.use(cors({
  origin: "http://localhost:5173",  // your frontend
  credentials: true
}));  

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
 // Middleware to parse JSON bodies
app.use("/api/auth", authRoutes); 
app.use("/api/message", messageRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });

}
// Use the auth routes for /api/auth endpoint

server.listen(PORT , () => {   
    console.log("Server is running on port " + PORT);
    connectDB();
});