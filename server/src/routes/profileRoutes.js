import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getProfile);
router.patch("/", protect, updateProfile);
router.patch("/password", protect, updatePassword);

export default router;
