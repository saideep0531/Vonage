const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

async function appendToSheet({ phoneNumber, message }) {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    "Phone Number": phoneNumber,
    "Message": message,
    "Time": new Date().toLocaleString(),
    "Assistant Name": "Saideep",
    "Call Duration": "N/A",
    "Transcription Summary": "N/A"
  });

  console.log("✅ Logged to Google Sheet");
}

module.exports = appendToSheet;