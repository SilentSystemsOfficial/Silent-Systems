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

// ===== Nodemailer Setup =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,        // 🔹 Replace with your Gmail
    pass: process.env.EMAIL_PASS      // 🔹 Replace with App Password
  }
});

// ===== Handle Contact Form =====
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields required." });
  }

  // Optional: still save to JSON locally
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
    from: email,
    to: "sahibnarula106@gmail.com",   // 🔹 Your inbox
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
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

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Silent Systems running on port ${PORT}`));
