import express from "express";
import protectedRoute from "../middleware/protectedRoute.js";
import {  sendMessage ,getMessages ,getUsersForSidebar} from "../controllers/message.js";
const router = express.Router();

router.get("/conversations", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);

export default router;