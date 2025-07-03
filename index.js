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

  vonage.sms.send({ to: phoneNumber, from: process.env.VONAGE_FROM_NUMBER, text: message }, async (err, result) => {
    if (err || result.messages[0].status !== '0') {
      return res.status(500).json({ success: false, error: err || result.messages[0]['error-text'] });
    }

    const log = {
      Phone: phoneNumber,
      Message: message,
      Time: new Date().toLocaleString(),
      Status: 'Success',
    };

    try {
      await appendToSheet(log);
      res.json({ success: true, data: result });
    } catch (sheetErr) {
      console.error("❌ Sheet logging failed:", sheetErr.message);
      res.status(500).json({ success: false, error: "Sheet logging failed" });
    }
  });
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
