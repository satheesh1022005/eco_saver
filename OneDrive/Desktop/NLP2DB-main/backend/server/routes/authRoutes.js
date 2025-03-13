import express from "express";
const router = express.Router();
import {
  login,
  register,
  getUser,
  verifyEmail,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/getUser", authMiddleware, getUser);
router.get("/auth/verify-email/:token", verifyEmail);
router.get("/auth/verifyToken", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
export default router;
