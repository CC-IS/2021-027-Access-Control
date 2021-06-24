  class getDataFromSheet{

    constructor (){
        this.authorize();
        // const spreadsheetId = "1XMSZRJNUllFxmb1unSxeeKXc7FFdT1XikAEPd5OSgrA";
        this.spreadsheetId = "1k3eZkkqm1bWA3lk8gUgfoR6Xpb2vVaX4iaqnizi5iDc";
        this.getUsers().then((result)=>{
            this.users = result.data.values;
            this.onReady();
        })

    }
    onReady(){
    }
    async isAdminPresent(){
        return await (this.googleSheets.spreadsheets.values.get({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: 'Authorizations!B2:B2'
        }));
    }
    authorize (){
        const { google } = require("googleapis");
        this.googleSheets = google.sheets({ version: "v4", auth: this.client});

        this.auth = new google.auth.GoogleAuth({
            keyFile: "C:/Users/phyys/Desktop/Credentials.json",
            // keyFile: "/boot/Credentials.json",
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
        if (this.isUser(UID)){
            this.changeCell(`${String.fromCharCode(65 + col)}${this.getIndex(UID)+2}`,1);
            console.log(`User ${UID} permitted access successfully to ${devName}`);
           this.authorize();
        } else{
            this.addNewRow(UID).then(()=>{
            console.log(`User ${UID} was added to database. Granting access...`)
            this.addUser(UID,col,devName);
        })
    }
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
    isUser(UID){
        // var _this = this;
        return JSON.stringify(this.users).includes(UID);

    }
    getIndex(UID){
        // this.getUsers().then((result){
        //     usersresult.data.values
        // })
        let index2;
        this.users.forEach((Element,index) => {
            if (Element[0] && Element[0] == UID){
                index2 = index;
            }
          })
          return index2;
    }
    async getDevNum(name){
        let returnedValue = 0;
        await this.getRow(-1).then((rowData)=>{    
            returnedValue = (rowData.data.values[0].indexOf(name)); 
        })
        return returnedValue;
    }
    async hasAccess(UID,devNum){
        let found;
        await this.getRow(this.getIndex(UID)).then((result)=>{
            if ((result.data.values[0][devNum]) ==1 ){
                found =  true;
            } else {
                found = false;
            }
    })   
    return found;
    }
    async isAdmin(UID){
        let found;
        await this.getRow(this.getIndex(UID)).then((result)=>{
            if ((result.data.values[0][1]) ==1 ){
                found =  true;
            } else {
                found = false;
            }
    })   
    return found;
    }
        
  }
exports.getDataFromSheet = getDataFromSheet ;