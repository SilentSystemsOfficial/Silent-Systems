import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== RESEND (SMTP) Setup =====
// You’ll get this key from https://resend.com after signing up
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY, // add this in Render’s environment variables
  },
});

// ===== Contact Form Handler =====
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields required." });
  }

  // Optional: Save messages locally (for local testing only)
  const newEntry = { name, email, message, date: new Date().toISOString() };
  const filePath = path.join(__dirname, "messages.json");
  let messages = [];
  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
  }
  messages.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  // ===== Email Notification =====
  const mailOptions = {
    from: "onboarding@resend.dev", 
    to: "sahibnarula106@gmail.com",
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email error:", error);
      return res.status(500).json({ success: false, message: "Failed to send email." });
    }
    console.log("📨 Email sent:", info.response);
    res.json({ success: true, message: "Message sent successfully!" });
  });
});

// ===== Serve main page =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Silent Systems running on port ${PORT}`));
