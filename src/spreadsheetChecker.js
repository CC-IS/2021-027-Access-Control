  class getDataFromSheet{

    constructor (spreadsheetId, keyFile){
        this.authorize(keyFile);
        this.spreadsheetId = spreadsheetId;
        this.users=[];
        this.usrs =[];
        this.usersarr =[]
        this.keyFile = keyFile;
    }
    

    async update(){
        var _this = this;
        await this.getBatch().then((result)=>{
        //   console.log(result.data.valueRanges[0].values[0]);
        this.usrs = result.data.valueRanges[0].values;
    
          var keys = this.usrs[0];
          _this.adminPresent =this.usrs[1][1];
          this.usrs.slice(2).forEach((row, i) => {
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
    authorize (keyFile){
        const { google } = require("googleapis");
        this.googleSheets = google.sheets({ version: "v4", auth: this.client});

        this.auth = new google.auth.GoogleAuth({
            keyFile,
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });
        this.client = this.auth.getClient();
    }
    async getBatch() {
        return await this.googleSheets.spreadsheets.values.batchGet({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            ranges:['Authorizations']
            })    
    }
    // async getUsers (){
    //     return await this.googleSheets.spreadsheets.values.get({
    //         auth: this.auth,
    //         spreadsheetId: this.spreadsheetId,
    //         range: 'Authorizations!A2:A'
    //     })
    // } 
    // async getRow(row) {
    //     return await this.googleSheets.spreadsheets.values.get({
    //         auth: this.auth,
    //         spreadsheetId: this.spreadsheetId,
    //         range: `Authorizations!${row+2}:${row+2}`
    //     });    
    // }
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
    async addUser(UID,devName){
        if (this.usersarr.includes(UID)){
            this.changeCell(`${String.fromCharCode(68 + this.getDevNum(UID))}${this.getIndex(UID)+3}`,1);
            console.log(`User ${UID} permitted access successfully to ${devName}`);
           this.authorize(this.keyFile);
        } else{
            this.addNewRow(UID).then(()=>{
            console.log(`User ${UID} was added to database. Granting access...`)
            this.addUser(UID,devName);
        })
    }
    }
    async addNewRow(UID){
        if (this.usersarr.includes(UID)){return;}
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
        let index2;
        this.users.forEach((Element,index) => {
            // console.log (Element);
            if (Element['userRFID'] && Element['userRFID'] == UID){
                index2 = index;
            }
          })
          return index2;
        }
    getDevNum(name){
        return this.usrs[0].indexOf(name)
    }

    // async hasAccess(UID,devNum){
    //     let found;
    //     await this.getRow(this.getIndex(UID)).then((result)=>{
    //         if ((result.data.values[0][devNum]) ==1 ){
    //             found =  true;
    //         } else {
    //             found = false;
    //         }
    // })   
    // return found;
    // }
    // async isAdmin(UID){
    //     let found;
    //     await this.getRow(this.getIndex(UID)).then((result)=>{
    //         if ((result.data.values[0][1]) ==1 ){
    //             found =  true;
    //         } else {
    //             found = false;
    //         }
    // })   
    // return found;
    // }
        
  }
exports.getDataFromSheet = getDataFromSheet ;