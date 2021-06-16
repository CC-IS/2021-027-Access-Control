const getDataFromSheet = async function test (){
    const { google } = require("googleapis");
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client});
    const spreadsheetId = "1XMSZRJNUllFxmb1unSxeeKXc7FFdT1XikAEPd5OSgrA";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:A",    
        })
    return getRows.data;
}
module.exports = {getDataFromSheet};
