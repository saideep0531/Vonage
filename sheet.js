const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./gcreds.json');

const appendToSheet = async (phone, message) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const now = new Date().toLocaleString();

    await sheet.addRow({
      "Phone Number": phone,
      "Message": message,
      "Time": now,
      "Assistant Name": "Saideep Guddla",
      "Call Duration": "N/A",
      "Transcription Summary": "N/A"
    });

    console.log("📄 Sheet updated");
  } catch (err) {
    console.error("❌ Sheet update failed:", err.message);
  }
};

module.exports = appendToSheet;
