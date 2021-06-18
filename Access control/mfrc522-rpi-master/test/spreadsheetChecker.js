  class getDataFromSheet{

    constructor (){
        this.authorize();
        // const spreadsheetId = "1XMSZRJNUllFxmb1unSxeeKXc7FFdT1XikAEPd5OSgrA";
        this.spreadsheetId = "1k3eZkkqm1bWA3lk8gUgfoR6Xpb2vVaX4iaqnizi5iDc";
    }
    authorize (){
        const { google } = require("googleapis");
        this.googleSheets = google.sheets({ version: "v4", auth: this.client});

        this.auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        this.client = this.auth.getClient();
    }
    async test(){
        return await this.googleSheets.spreadsheets.values.update({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range:['Authorizations!A9'],
            valueInputOption: 'USER-ENTERED',
            resource: {
                values:[[2]],
            }
            }) 
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
        await this.googleSheets.spreadsheets.values.update({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range:[`Authorizations!${A1}`],
            valueInputOption: 'USER-ENTERED',
            resource: {
                values:[[value]],
            }
            }) 
        }
    

    async addUser(UID,col,devName){
        let arr = [];
        await this.getUsers().then((result)=>{
             arr = this.foundUser (result.data.values,UID);
            //  console.log(arr);
             if (arr[0]){
                //  console.log(col);
                 this.changeCell(`${String.fromCharCode(65 + col)}${arr[1]+2}`,1);
                 console.log(`User ${UID} permitted access successfully to ${devName}`);
                this.authorize();
                 
                 // change col to be 1
             }
             else{
                this.addNewRow(UID).then(()=>{
                    console.log(`User ${UID} was added to database. Granting access...`)
                    this.addUser(UID,col,devName);
                })
                //add new line with zeros
                 //call adduser again
             }
        })
    }
    async addNewRow(UID){
        await this.googleSheets.spreadsheets.values.append({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: "Authorizations!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
              values: [[UID, 0,0,0,0,0,0]],
            },
    })
}

    foundUser(values, UID){
        let found = [false,0];
        // console.log(values, UID);
        console.log("Values of users are: ");
        console.log(values);
        values.forEach((Element,index) => {
          if (Element[0] && Element[0].includes(UID)){
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