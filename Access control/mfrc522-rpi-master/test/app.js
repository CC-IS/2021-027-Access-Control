const {getDataFromSheet} = require('./spreadsheetChecker');
const {readClass} = require('./read');
const control = require('./controllingMachine');
const { managedidentities } = require('googleapis/build/src/apis/managedidentities');
const devName="CCIS-VBS-001";
let access =0;
let adminUIDs =["c66759a5"];
const sheet = new getDataFromSheet();
let devNum = 0;
sheet.getDevNum(devName).then ((value)=>{devNum = value});
const rfid = new readClass();
let progmode = false;
let terminateID;
let loop;
sheet.onReady = ()=>{
  loop = function (result){

    setInterval( ( async function() {
      let UID = rfid.readCards();
      if (!UID){
        console.log("Insert Card");
        return;
      }
      console.log(UID);
      if (adminUIDs.includes(UID)){
        progmode = true;
        console.log('Entered Programming Mode.. please input user card after 3 seconds');
        console.log ('Note: Programming mode will end in 30 seconds from now.');
        setTimeout(()=>{ progMode = false;}, 30000);
      } else if(progmode && !adminUIDs.includes(UID)){
        await addUser(UID);
      } 

      else{
        // console.log (devNum + "is dev num");
        console.log("access " + sheet.hasAccess(UID,devNum));
      if (sheet.isUser(UID) && sheet.hasAccess(UID,devNum)){
        
        control.runMachine();
      } else if (sheet.isUser(UID) && !sheet.hasAccess(UID,devNum)){
          control.stopMachine();
      } else {
        console.log("User doesn't exist.");
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
      clearInterval(loop);
    });
  }
  