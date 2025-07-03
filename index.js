require('dotenv').config();
const express = require('express');
const appendToSheet = require('./sheet');
const { Vonage } = require('@vonage/server-sdk');

const app = express();
app.use(express.json());

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

app.post('/notify', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const smsResponse = await vonage.sms.send({
      to: phoneNumber,
      from: process.env.VONAGE_FROM_NUMBER,
      text: message,
    });

    console.log("✅ SMS Response:", smsResponse);
    await appendToSheet(phoneNumber, message);
    res.status(200).json({ success: true, message: "SMS sent and logged." });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
