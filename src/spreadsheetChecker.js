  class getDataFromSheet{

    constructor (spreadsheetId, keyFile){
        this.authorize(keyFile);
        this.spreadsheetId = spreadsheetId;
        this.users=[];
        this.usersarr =[]
    }
    onReady(){
    }

    async update(){
        var _this = this;
        await this.getBatch().then((result)=>{
        //   console.log(result.data.valueRanges[0].values[0]);
          let usrs = result.data.valueRanges[0].values;
    
          var keys = usrs[0];
          _this.adminPresent =usrs[1][1];
          usrs.slice(2).forEach((row, i) => {
            _this.users[i] ={}
            keys.forEach((key, j) => {
              _this.users[i][key] = row[j];
            });
          });
        });
        this.users.forEach((user,index)=>{
            this.usersarr[index] = user.userRFID; 
        })
        return;
      }
    getUser(UID){
        return this.users[this.usersarr.indexOf(UID)];
    }

    async isAdminPresent(){
        return await (this.googleSheets.spreadsheets.values.get({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: 'Authorizations!B2:B2'
        }));
    }
    authorize (keyFile){
        const { google } = require("googleapis");
        this.googleSheets = google.sheets({ version: "v4", auth: this.client});

        this.auth = new google.auth.GoogleAuth({
            keyFile,
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