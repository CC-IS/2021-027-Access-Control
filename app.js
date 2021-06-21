const config = require ('/boot/config.json');
const {getDataFromSheet} = require('./src/spreadsheetChecker');
const {readClass} = require('./src/read');
<<<<<<< HEAD
const controller = require('./src/controller.js');
const devName = config.device;
const adminUIDs = config.admins;
=======
const control = require('./src/controllingMachine');

const {HardwareControl} = require('./src/controller.js');
// const { managedidentities } = require('googleapis/build/src/apis/managedidentities');
// const devName="CCIS-VBS-001";
const devName = config.device;
const adminUIDs = config.admins;
// let adminUIDs =["c66759a5"];

var hw = new HardwareControl({
  manufacturer: 'Silicon Labs'
});

>>>>>>> 3bfecf091abf2366ca7c1e2f35371d93a8735079
const sheet = new getDataFromSheet();
let devNum;
const rfid = new readClass();
let progmode = false;
let loop;

const ControllerInstance = new controller();

sheet.onReady = ()=>{
    loop =async  function (result){
    sheet.getDevNum(devName).then ((value)=>{devNum = value});

    setInterval( ( async function() {
      let UID = rfid.readCards();
      //mode 1, no UID
      if (!UID){
        console.log("Insert Card");
        return;
      }
      console.log(UID);
<<<<<<< HEAD
      //mode 2, admin needs to include and switch is on 
      if (adminUIDs.includes(UID)){
        controller.mode = 'program';
=======
      if (adminUIDs.includes(UID) && hw.switch){
        hw.mode = 'program';
>>>>>>> 3bfecf091abf2366ca7c1e2f35371d93a8735079
        progmode = true;
        console.log('Entered Programming Mode.. please input user card after 3 seconds');
        console.log ('Note: Programming mode will end in 30 seconds from now.');
        setTimeout(()=>{ progMode = false;}, 30000);
      } 
      // case 3 adding a user
      else if(progmode && !adminUIDs.includes(UID)){
        await addUser(UID);
      }
      // case 4 check access needs to include an if statement for admin 
      else{
      let access;
      await sheet.hasAccess(UID,devNum).then((result)=>{
        access = result;
      })
<<<<<<< HEAD
      let isAdminPresent;
      await sheet.isAdminPresent().then((result)=>{
        isAdminPresent =  result.data.values[0][0]);
      })
      if (sheet.isUser(UID) && access && isAdminPresent == 1){
        controller.mode = 'enable';
        //control.runMachine();
      }
      else if (sheet.isUser(UID) && access){
        controller.mode = 'idle';
        console.log("Please ask admin to be present");
      }

       else if (sheet.isUser(UID) && !access){
        controller.mode = 'idle';
=======

      //console.log("access " + sheet.hasAccess(UID,devNum));
      // console.log(access);
      if (sheet.isUser(UID) && access){
        hw.mode = 'enable';
        //control.runMachine();
      } else if (sheet.isUser(UID) && !access){
        hw.mode = 'idle';
        //control.stopMachine();
>>>>>>> 3bfecf091abf2366ca7c1e2f35371d93a8735079
      } else {
        console.log("User doesn't exist.");
        hw.mode = 'idle
        return;
      }
      }
    }),2000)
  }
  loop();
}
async function addUser(UID){
  console.log("Initiating add user");
    sheet.addUser(UID,devNum,devName).then(()=>{
      progmode = false;
      hw.mode = 'idle';
      clearInterval(loop);
    });
  }
