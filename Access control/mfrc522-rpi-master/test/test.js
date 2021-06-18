const {getDataFromSheet} = require('./spreadsheetChecker');
const sheet = new getDataFromSheet();

// // sheet.addUser('this is UID', 1);

// Delay(5000);
// console.log("x");

// const x = setInterval(() => {
//     console.log("running");
// }, 2000);

// clearInterval(x);

sheet.onReady = ()=>{
    console.log(sheet.isUser(230213));
    console.log(sheet.getIndex(230213));
}


