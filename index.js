require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Vonage } = require('@vonage/server-sdk');
const appendToSheet = require('./sheet');

const app = express();
app.use(bodyParser.json());

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

app.post('/notify', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const smsResult = await vonage.sms.send({
      to: phoneNumber,
      from: process.env.VONAGE_FROM_NUMBER,
      text: message,
    });

    console.log("✅ SMS sent:", smsResult);

    await appendToSheet({ phoneNumber, message });
    res.json({ success: true, data: smsResult });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});