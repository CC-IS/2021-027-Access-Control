let {getDataFromSheet} = require('./spreadsheetChecker.js');

let updater = new getDataFromSheet();

class Users extends Array {
  constructor(){
    updater.onReady(()=>{
      await update();
    })

  }

  async update(){
    var _this = this;
    await updater.getBatch().then((result)=>{
      let usrs = result.data.values;
      var keys = usrs[0];
      _this.adminPresent = usrs[1][1];
      usrs.slice(2).forEach((row, i) => {
        keys.forEach((key, j) => {
          _this[i][key] = row[j];
        });
      });
    });
  }
}

exports.Users = Users;
