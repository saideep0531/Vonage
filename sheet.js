const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./gcreds.json');

const appendToSheet = async (data) => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow(data);
};

module.exports = appendToSheet;
