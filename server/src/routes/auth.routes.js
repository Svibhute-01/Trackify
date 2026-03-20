import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Get current user
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;