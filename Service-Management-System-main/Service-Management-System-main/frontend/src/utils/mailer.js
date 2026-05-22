import nodemailer from "nodemailer";
import { config } from "../config/config.js"; 

console.log("Email User:", config.emailUser);
console.log("Email Pass Loaded:", !!config.emailPass);

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});