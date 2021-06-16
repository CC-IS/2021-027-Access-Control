const getDataFromSheet = async function test (){
    const { google } = require("googleapis");
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client});
    // const spreadsheetId = "1XMSZRJNUllFxmb1unSxeeKXc7FFdT1XikAEPd5OSgrA";
    const spreadsheetId = "1k3eZkkqm1bWA3lk8gUgfoR6Xpb2vVaX4iaqnizi5iDc";

    const getBatch = await googleSheets.spreadsheets.values.batchGet({
        auth,
        spreadsheetId,
        ranges:['Authorizations']
        })
    const getRow = async function(row){
        return await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `Authorizations!${1}:${1}`
        });    
    }

    const getUsers = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Authorizations!A2:A'
    })
    //console.log(JSON.stringify(getUsers.data, null, 2));
    return {
        // batch:JSON.stringify(getBatch.data, null, 2),
        // row: JSON.stringify((await getRow()).data, null, 2),
        // users:JSON.stringify(getUsers.data, null, 2)
        batch:getBatch.data,
        row: (await getRow()).data,
        users: getUsers.data
    };
}
// exports.getDataFromSheet = getDataFromSheet;
// exports.getRow = getDataFromSheet.getRow();
 module.exports = {getDataFromSheet};
//  module.exports.getRows = getDataFromSheet.getRow();
