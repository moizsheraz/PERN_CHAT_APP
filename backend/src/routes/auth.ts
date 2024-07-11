import express from "express";
import { signup,login,logout,getMe} from "../controllers/auth.js";
import protectedRoute from "../middleware/protectedRoute.js"
const router = express.Router();

// router.get("/me", protectRoute, getMe);
router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);






export default router;