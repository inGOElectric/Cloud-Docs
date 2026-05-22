import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import crypto from "crypto";

export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    console.log("PASSWORD MATCH:", match);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
  {
    id: user.id,
    role: user.role,
    name: user.name   // ✅ ADD THIS LINE ONLY
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
    return res.json({ token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

/**
 * STAFF LOGIN
 * Authenticates staff (non-customer) users only
 * Rejects CUSTOMER role
 */
export const staffLogin = async (req, res) => {
  try {
    console.log("STAFF LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("STAFF USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // REJECT CUSTOMER ROLE
    if (user.role === "CUSTOMER") {
      return res.status(403).json({ error: "Customers must use customer login" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    console.log("STAFF PASSWORD MATCH:", match);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
  {
    id: user.id,
    role: user.role,
    name: user.name   // ✅ ADD THIS LINE ONLY
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    return res.json({ token, user });
  } catch (err) {
    console.error("STAFF LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

/********************
 * PASSWORD RESET
 ********************/

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Always respond same (security)
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent."
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing (important)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 min
      }
    });

    // In production → send email here
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    console.log("RESET LINK:", resetUrl);

    return res.json({
      message: "If the email exists, a reset link has been sent."
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return res.json({
      message: "Password reset successful"
    });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};