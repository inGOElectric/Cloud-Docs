import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { transporter } from "../utils/mailer.js";

const prisma = new PrismaClient();

/* =========================
   CUSTOMER LOGIN
========================= */

export const customerLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { mobileNumber },
    });

    if (!customer || !customer.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, customer.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { customerId: customer.id, role: "CUSTOMER" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: customer.id,
        name: customer.name,
        mobileNumber: customer.mobileNumber,
        role: "CUSTOMER",
      },
    });
  } catch (err) {
    console.error("CUSTOMER LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   CUSTOMER FORGOT PASSWORD
========================= */

export const customerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    // Prevent email enumeration
    if (!customer) {
      return res.json({
        message: "If email exists, reset link sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetLink = `http://localhost:5173/customer-reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"EV Service Platform" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.json({
      message: "If email exists, reset link sent.",
    });
  } catch (err) {
    console.error("CUSTOMER FORGOT ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   CUSTOMER RESET PASSWORD
========================= */

export const customerResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const customer = await prisma.customer.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!customer) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("CUSTOMER RESET ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};