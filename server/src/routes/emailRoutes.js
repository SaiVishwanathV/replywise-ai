import { Router } from "express";
import {
  generateReplyController,
  rewriteReplyController,
  summarizeEmailController,
} from "../controllers/emailController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/reply", protect, generateReplyController);
router.post("/rewrite", protect, rewriteReplyController);
router.post("/summary", protect, summarizeEmailController);

export default router;
