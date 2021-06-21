const {getDataFromSheet} = require ('./spreadsheetChecker.js');

const sheet = new getDataFromSheet();


sheet.isAdminOn().then((result)=>{
    console.log(result);
})