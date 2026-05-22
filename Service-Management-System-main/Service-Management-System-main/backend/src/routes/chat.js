import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  let reply = "I can help you with bike info or booking a test ride.";

  if (!message) {
    return res.json({ reply });
  }

  const msg = message.toLowerCase();

  if (msg.includes("bike")) {
    reply = `
We have two models:

🚀 Flee C2
• Range: 120 km
• Top Speed: 75 km/h

⚡ Flee B1
• Range: 90 km
• Top Speed: 60 km/h

Would you like to view brochure or book a test ride?
    `;
  }

  else if (msg.includes("book")) {
    reply = "Great! Let's start your booking. What is your name?";
  }

  res.json({ reply });
});

export default router;