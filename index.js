require('dotenv').config();
const express = require('express');
const {Vonage} = require('@vonage/server-sdk');
const appendToSheet = require('./sheet');

const app = express();
app.use(express.json());

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

app.post('/notify', async (req, res) => {
  const { phoneNumber, message } = req.body;

  vonage.message.sendSms(
    process.env.VONAGE_FROM_NUMBER,
    phoneNumber,
    message,
    async (err, responseData) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }

      if (responseData.messages[0].status !== "0") {
        return res.status(500).json({ success: false, error: "Failed to send SMS" });
      }

      try {
        await appendToSheet(phoneNumber, message);
        res.status(200).json({ success: true, data: responseData.messages[0] });
      } catch (sheetError) {
        res.status(500).json({ success: false, error: "Sheet update failed", sheetError });
      }
    }
  );
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
