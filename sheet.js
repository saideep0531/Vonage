const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./gcreds.json');

const appendToSheet = async (data) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow(data);
  } catch (error) {
    console.error("❌ Sheet update failed:", error.message);
    throw error;
  }
};

module.exports = appendToSheet;
