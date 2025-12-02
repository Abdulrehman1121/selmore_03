import { Router } from "express";
import { login, register, me } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimiter";
import { authGuard } from "../middleware/auth";

const router = Router();

// Apply strict rate limiting to auth endpoints
router.post("/login", authLimiter, login);
router.post("/register", authLimiter, register);

// Protected route to get current user
router.get("/me", authGuard, me);

export default router;