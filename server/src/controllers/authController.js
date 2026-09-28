import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import {
  generate6DigitOTP,
  hashOTP,
  verifyOTPHash,
  sendOTPEmail,
} from "../services/otpService.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_access_key_replywise_2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super_secret_jwt_refresh_key_replywise_2026";

const generateTokens = (userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { token, refreshToken };
};

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    console.log("[Signup] Signup request received for email:", email);

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username is already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        emailVerified: false,
      },
    });

    // Generate & send OTP
    const otp = generate6DigitOTP();
    console.log("[Signup] OTP generated for:", email);

    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await prisma.oTPToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });
    console.log("[Signup] OTP saved to database for user ID:", user.id);

    await sendOTPEmail(user.email, otp, user.name || user.username);

    return res.status(201).json({
      success: true,
      message: "Account created! A 6-digit OTP has been sent to your email.",
      requireOtp: true,
      email: user.email,
    });
  } catch (error) {
    console.error("[Signup Error]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email.",
      error: error.message || error,
    });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP code are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpRecord = await prisma.oTPToken.findFirst({
      where: { userId: user.id },
      orderBy: { expiresAt: "desc" },
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "No active OTP code found" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTPToken.delete({ where: { id: otpRecord.id } });
      return res.status(400).json({ success: false, message: "OTP code has expired. Please request a new one." });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(400).json({ success: false, message: "Maximum OTP verification attempts exceeded." });
    }

    const isValid = await verifyOTPHash(otp, otpRecord.otpHash);
    if (!isValid) {
      await prisma.oTPToken.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    // Verify user email & delete OTP token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        avatar: true,
      },
    });

    await prisma.oTPToken.delete({ where: { id: otpRecord.id } });

    // Generate tokens & session
    const { token, refreshToken } = generateTokens(user.id);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Email verified successfully!",
      token,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error during OTP verification" });
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("[Resend OTP] Request received for email:", email);

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Clear old OTPs
    await prisma.oTPToken.deleteMany({ where: { userId: user.id } });

    const otp = generate6DigitOTP();
    console.log("[Resend OTP] New OTP generated for:", email);

    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.oTPToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });
    console.log("[Resend OTP] OTP saved to database for user ID:", user.id);

    await sendOTPEmail(user.email, otp, user.name || user.username);

    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error("[Resend OTP Error]", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email.",
      error: err.message || err,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email/username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email/username or password" });
    }

    const { token, refreshToken } = generateTokens(user.id);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      avatar: user.avatar,
    };

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: userProfile,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    if (req.user) {
      await prisma.session.deleteMany({ where: { userId: req.user.id } });
    }
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ success: false, message: "Server error during logout" });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist" });
    }

    await prisma.oTPToken.deleteMany({ where: { userId: user.id } });

    const otp = generate6DigitOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.oTPToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    await sendOTPEmail(user.email, otp, user.name || user.username);

    return res.json({ success: true, message: "Password reset OTP sent to your email!" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email.",
      error: err.message || err,
    });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otpRecord = await prisma.oTPToken.findFirst({
      where: { userId: user.id },
      orderBy: { expiresAt: "desc" },
    });

    if (!otpRecord) return res.status(400).json({ success: false, message: "No reset request found" });

    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTPToken.delete({ where: { id: otpRecord.id } });
      return res.status(400).json({ success: false, message: "Reset code has expired" });
    }

    const isValid = await verifyOTPHash(otp, otpRecord.otpHash);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid reset code" });

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    await prisma.oTPToken.delete({ where: { id: otpRecord.id } });

    return res.json({ success: true, message: "Password updated successfully! You can now log in." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ success: false, message: "Server error resetting password" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  return res.json({ success: true, user: req.user });
};
