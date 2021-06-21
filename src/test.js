const {getDataFromSheet} = require ('./spreadsheetChecker.js');

const sheet = new getDataFromSheet();

// const {HardwareControl} = require('./controller.js');

// const ControllerInstance = new HardwareControl("test");

// console.log(ControllerInstance.get.mode());



sheet.getRow(1).then((result)=>{
    console.log(result.data.values);
})