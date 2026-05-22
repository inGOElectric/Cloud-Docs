import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const router = express.Router();

/* =========================
   MAIL TRANSPORTER
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   CUSTOMER LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const mobile = String(mobileNumber).trim();

    const customer = await req.prisma.customer.findUnique({
      where: { mobileNumber: mobile },
    });

    if (!customer || !customer.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        customerId: customer.id,
        role: "CUSTOMER",
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        mobileNumber: customer.mobileNumber,
        role: "CUSTOMER",
      },
    });
  } catch (err) {
    console.error("CUSTOMER LOGIN ERROR ❌", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const customer = await req.prisma.customer.findUnique({
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

    await req.prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetLink = `http://localhost:5173/customer-reset-password?token=${resetToken}`;

    try {
      const info = await transporter.sendMail({
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

      console.log("EMAIL SENT SUCCESS:", info.response);
    } catch (mailError) {
      console.error("EMAIL SEND FAILED ❌", mailError);
    }

    return res.json({
      message: "If email exists, reset link sent.",
    });
  } catch (err) {
    console.error("CUSTOMER FORGOT ERROR ❌", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* =========================
   RESET PASSWORD
========================= */

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Missing data" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const customer = await req.prisma.customer.findFirst({
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

    await req.prisma.customer.update({
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
    console.error("CUSTOMER RESET ERROR ❌", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;