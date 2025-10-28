import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { Resend } from "resend";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== RESEND HTTP API SETUP =====
const resend = new Resend(process.env.RESEND_API_KEY);

// ===== Contact Form Handler =====
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields required." });
  }

  // Optional: store locally (for local dev)
  const newEntry = { name, email, message, date: new Date().toISOString() };
  const filePath = path.join(__dirname, "messages.json");
  let messages = [];
  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
  }
  messages.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  try {
    // ===== Send Email via Resend API =====
    const result = await resend.emails.send({
      from: "Silent Systems <onboarding@resend.dev>",
      to: "silentsystems.team@gmail.com", // 🔹 your inbox
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("📨 Email sent successfully:", result);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// ===== Serve main page =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Silent Systems running on port ${PORT}`));
