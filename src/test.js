const {getDataFromSheet} = require ('./spreadsheetChecker.js');

const sheet = new getDataFromSheet();


sheet.isAdminPresent().then((result)=>{
    console.log(result.data.values[0]);
})