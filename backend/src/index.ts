import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors middleware
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messageroute.js';
import { app, server } from "./socket/socket.js";

const port = 3000;

// CORS configuration
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
