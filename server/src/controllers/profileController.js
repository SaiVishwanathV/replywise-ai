import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        avatar: true,
        createdAt: true,
      },
    });

    const historyCount = await prisma.emailHistory.count({
      where: { userId: req.user.id },
    });

    return res.json({
      user,
      stats: {
        totalGenerations: historyCount,
      },
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PATCH /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    if (!name || !username || !email) {
      return res.status(400).json({ message: "Name, username, and email are required" });
    }

    // Check if username/email already used by another user
    if (username !== req.user.username) {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    if (email !== req.user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== req.user.id) {
        return res.status(400).json({ message: "Email is already registered" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, username, email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        avatar: true,
        createdAt: true,
      },
    });

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// PATCH /api/profile/password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newPasswordHash },
    });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update Password Error:", err);
    return res.status(500).json({ message: "Failed to update password" });
  }
};
