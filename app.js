const config = require ('/boot/config.json');
// const config = require('./config.json');

const {getDataFromSheet} = require('./src/spreadsheetChecker');
const {readClass} = require('./src/read');
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

const sheet = new getDataFromSheet();
let devNum;
const rfid = new readClass();
let progmode = false;
let loop;
sheet.onReady = ()=>{
  loop =async  function (result){

    setInterval( ( async function() {
      sheet.getDevNum(devName).then ((value)=>{devNum = value});

      let UID = rfid.readCards();
      if (!UID){
        console.log("Insert Card");
        return;
      }
      console.log(UID);
      if (adminUIDs.includes(UID) && hw.switch){
        hw.mode = 'program';
        progmode = true;
        console.log('Entered Programming Mode.. please input user card after 3 seconds');
        console.log ('Note: Programming mode will end in 30 seconds from now.');
        setTimeout(()=>{ progMode = false;}, 30000);
      } else if(progmode && !adminUIDs.includes(UID)){
        await addUser(UID);
      }
      else{
      let access;
      await sheet.hasAccess(UID,devNum).then((result)=>{
        access = result;
      })

      //console.log("access " + sheet.hasAccess(UID,devNum));
      // console.log(access);
      if (sheet.isUser(UID) && access){
        hw.mode = 'enable';
        //control.runMachine();
      } else if (sheet.isUser(UID) && !access){
        hw.mode = 'idle';
        //control.stopMachine();
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
