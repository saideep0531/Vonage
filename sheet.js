const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./gcreds.json');

async function appendToSheet(phoneNumber, message) {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  // ✅ Ensure the private_key has correct line breaks
  if (typeof creds.private_key === 'string' && creds.private_key.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }

  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const now = new Date().toLocaleString();
  await sheet.addRow({
    "Phone Number": phoneNumber,
    "Message": message,
    "Time": now,
  });
}

module.exports = appendToSheet;
