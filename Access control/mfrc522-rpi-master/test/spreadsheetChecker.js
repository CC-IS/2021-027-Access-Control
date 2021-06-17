  class getDataFromSheet{

    constructor (){
        this.progmode = false;
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
            range: `Authorizations!${row+2}:${row+2}`
        });    
    }
    async changeCell(A1,value){
        await (await this.googleSheets.spreadsheets.values.update({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: A1,
            valueInputOption:'userInput',
            resource: {
                value: value
            }
        })).data

    }
    async addUser(UID,col){
        let arr = [];
        await this.getUsers().then((result)=>{
             arr = this.foundUser (result.data.values);
             if (arr[0]){
                 this.changeCell(A8,"Hello");
                 // change col to be 1
             }
             else{
                 //add new line with zeros
                 //call adduser again
             }
        })
    }

    foundUser(values, UID){
        let found = [false,0];
        // console.log(values, UID);
        values.forEach((Element,index) => {
          if (Element[0].includes(UID)){
            found[0] = true;
            found[1] = index;
          }
        });
          return found;
      }
    async getDevNum(name){
        let returnedValue = 0;
        await this.getRow(-1).then((rowData)=>{    
            returnedValue = (rowData.data.values[0].indexOf(name)); 
        })
        return returnedValue;
    }
    
}
exports.getDataFromSheet = getDataFromSheet ;