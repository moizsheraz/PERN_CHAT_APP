import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors middleware
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messageroute.js';
import { app, server } from "./socket/socket.js";
import path from "path"

const port = 3000;
const _dirname = path.resolve();
// CORS configuration
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV !== "development") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
	});
}


server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
  });
