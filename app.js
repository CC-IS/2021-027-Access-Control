const config = require ('/boot/config.json');
const {getDataFromSheet} = require('./src/spreadsheetChecker');
const {readClass} = require('./src/read');
const control = require('./src/controllingMachine');
const {HardwareControl} = require('./src/controller.js');
const devName = config.device;
const adminUIDs = config.admins;

var hw = new HardwareControl({
  manufacturer: 'Silicon Labs'
});

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
      //mode 2, admin needs to include and switch is on 
      if (adminUIDs.includes(UID) && hw.switch == 1){
        controller.mode = 'program';
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
      let isAdminPresent;
      await sheet.isAdminPresent().then((result)=>{
        isAdminPresent =  result.data.values[0][0];
      })

      if ((sheet.isUser(UID) && access && isAdminPresent == 1)){
        controller.mode = 'enable';
        //control.runMachine();
      }
      else if (sheet.isUser(UID) && access){
        controller.mode = 'idle';
        console.log("Please ask admin to be present");
      }

       else if (sheet.isUser(UID) && !access){
        controller.mode = 'idle';
      } else {
        console.log("User doesn't exist.");
        hw.mode = 'idle'
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
