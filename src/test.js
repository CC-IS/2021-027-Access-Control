// const {getDataFromSheet} = require ('./spreadsheetChecker.js');

// const sheet = new getDataFromSheet();

const {HardwareControl} = require('./controller.js');

const ControllerInstance = new HardwareControl("test");

console.log(ControllerInstance.get.mode());

// sheet.isAdminPresent().then((result)=>{
//     console.log(result.data.values[0][0]);
// })