import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  uploadPath: process.env.UPLOAD_PATH || "uploads",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",

  // Email configuration for nodemailer
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};