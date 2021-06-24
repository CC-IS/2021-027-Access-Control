// const {getDataFromSheet} = require ('./spreadsheetChecker.js');
//
// const sheet = new getDataFromSheet();
//
// // const {HardwareControl} = require('./controller.js');
//
// // const ControllerInstance = new HardwareControl("test");
//
// // console.log(ControllerInstance.get.mode());
//
//
// sheet.onReady = (()=>{
//     sheet.getBatch().then((result)=>{
//         console.log(JSON.stringify( result.data,null,2));
//     })
//
// ) 

const {Users} = require('./users');
let users = new Users();
users.update().then (()=>{

    console.log(users.length);

})
users.onReady =(()=>{
    
})

