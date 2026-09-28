import prisma from "../config/prisma.js";
import {
  generateReply,
  rewriteReply,
  summarizeEmail,
} from "../services/emailService.js";

// POST /api/email/reply
export const generateReplyController = async (req, res) => {
  try {
    const { originalEmail, tone, length, customInstructions } = req.body;

    if (!originalEmail || !originalEmail.trim()) {
      return res.status(400).json({ message: "Original email content is required" });
    }

    const reply = await generateReply({
      originalEmail,
      tone,
      length,
      customInstructions,
    });

    // Save to EmailHistory
    const historyItem = await prisma.emailHistory.create({
      data: {
        userId: req.user.id,
        subject: originalEmail.slice(0, 50).replace(/\n/g, " "),
        originalEmail,
        generatedReply: reply,
        tone: tone || "Professional",
        length: length || "Medium",
      },
    });

    return res.json({
      message: "Reply generated successfully",
      generatedReply: reply,
      history: historyItem,
    });
  } catch (err) {
    console.error("Generate Reply Error:", err);
    return res.status(500).json({ message: "Failed to generate reply" });
  }
};

// POST /api/email/rewrite
export const rewriteReplyController = async (req, res) => {
  try {
    const { originalEmail, existingReply, tone, length, customInstructions } = req.body;

    if (!originalEmail || !originalEmail.trim()) {
      return res.status(400).json({ message: "Original email content is required" });
    }

    const reply = await rewriteReply({
      originalEmail,
      existingReply,
      tone,
      length,
      customInstructions,
    });

    // Save to EmailHistory
    const historyItem = await prisma.emailHistory.create({
      data: {
        userId: req.user.id,
        subject: `[Rewritten] ${originalEmail.slice(0, 45).replace(/\n/g, " ")}`,
        originalEmail,
        generatedReply: reply,
        tone: tone || "Professional",
        length: length || "Medium",
      },
    });

    return res.json({
      message: "Reply rewritten successfully",
      generatedReply: reply,
      history: historyItem,
    });
  } catch (err) {
    console.error("Rewrite Reply Error:", err);
    return res.status(500).json({ message: "Failed to rewrite reply" });
  }
};

// POST /api/email/summary
export const summarizeEmailController = async (req, res) => {
  try {
    const { originalEmail } = req.body;

    if (!originalEmail || !originalEmail.trim()) {
      return res.status(400).json({ message: "Original email content is required" });
    }

    const result = await summarizeEmail({ originalEmail });

    // Save to EmailHistory
    const historyItem = await prisma.emailHistory.create({
      data: {
        userId: req.user.id,
        subject: `[Summary] ${originalEmail.slice(0, 45).replace(/\n/g, " ")}`,
        originalEmail,
        summary: result.summary,
      },
    });

    return res.json({
      message: "Email summarized successfully",
      summary: result.summary,
      keyPoints: result.keyPoints,
      history: historyItem,
    });
  } catch (err) {
    console.error("Summarize Email Error:", err);
    return res.status(500).json({ message: "Failed to summarize email" });
  }
};
