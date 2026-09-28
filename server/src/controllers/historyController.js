import prisma from "../config/prisma.js";

// GET /api/history
export const getHistory = async (req, res) => {
  try {
    const { search, tone, date } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (tone && tone !== "All") {
      where.tone = tone;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search } },
        { originalEmail: { contains: search } },
        { generatedReply: { contains: search } },
        { summary: { contains: search } },
      ];
    }

    if (date && date !== "all") {
      const now = new Date();
      let startDate;

      if (date === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (date === "week") {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (date === "month") {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      if (startDate) {
        where.createdAt = { gte: startDate };
      }
    }

    const history = await prisma.emailHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ history });
  } catch (err) {
    console.error("Get History Error:", err);
    return res.status(500).json({ message: "Failed to fetch email history" });
  }
};

// DELETE /api/history/:id
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const historyItem = await prisma.emailHistory.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!historyItem) {
      return res.status(404).json({ message: "History entry not found" });
    }

    await prisma.emailHistory.delete({
      where: { id },
    });

    return res.json({ message: "History item deleted successfully" });
  } catch (err) {
    console.error("Delete History Error:", err);
    return res.status(500).json({ message: "Failed to delete history item" });
  }
};
