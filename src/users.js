let {getDataFromSheet} = require('./spreadsheetChecker.js');

let updater = new getDataFromSheet();

class Users extends Array {
  constructor(){
    super();
    var _this= this;
    updater.onReady(()=>{
      update().then(()=>{
        _this.onReady();
      });

    })

  }

  async onReady(){

  }

  async update(){
    var _this = this;
    await updater.getBatch().then((result)=>{
      console.log(result.data.valueRanges[0].values[0]);
      let usrs = result.data.valueRanges[0].values;

      var keys = usrs[0];
      _this.adminPresent =usrs[1][1];
      usrs.slice(2).forEach((row, i) => {
        _this[i] ={}
        keys.forEach((key, j) => {
          _this[i][key] = row[j];
        });
      });
    });
    return;
  }
}

exports.Users = Users;
