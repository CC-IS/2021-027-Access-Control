  class getDataFromSheet{

    constructor (){
        const { google } = require("googleapis");
        this.auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });

        this.client = this.auth.getClient();
        this.googleSheets = google.sheets({ version: "v4", auth: this.client});
        // const spreadsheetId = "1XMSZRJNUllFxmb1unSxeeKXc7FFdT1XikAEPd5OSgrA";
        this.spreadsheetId = "1k3eZkkqm1bWA3lk8gUgfoR6Xpb2vVaX4iaqnizi5iDc";
    }

    async getBatch() {
        return await this.googleSheets.spreadsheets.values.batchGet({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            ranges:['Authorizations']
            })    
    }
        
    async getUsers (){
        return await this.googleSheets.spreadsheets.values.get({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: 'Authorizations!A2:A'
        })
    } 
     
    async getRow(row) {
        return await this.googleSheets.spreadsheets.values.get({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: `Authorizations!${1}:${1}`
        });    
}
}
exports.getDataFromSheet = getDataFromSheet ;