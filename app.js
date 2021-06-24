const config = require ('/boot/config.json');
const {getDataFromSheet} = require('./src/spreadsheetChecker');
const {readClass} = require('./src/read');
const control = require('./src/controllingMachine');
const {HardwareControl} = require('./src/controller.js');
const { admin } = require('googleapis/build/src/apis/admin');
const devName = config.device;

const {Users} = require('./users');
let users = new Users();
var hw = new HardwareControl({
  manufacturer: 'Arduino LLC'
});
const sheet = new getDataFromSheet();
let devNum;
const rfid = new readClass();
let progmode = false;
let loop;
const {Users} = require('./users');
let users = new Users();

hw.on('mode', (reportedMode)=>{
  console.log(reportedMode);
})

hw.on('switchState', state=>{
  console.log(state + ' is the switch state');
})
let lastSeen = null;



sheet.onReady = ()=>{
    
    hw.mode = 'enable';
    sheet.getDevNum(devName).then ((value)=>{devNum = value});

    setInterval( ( async function() {
      // if (hw.eStop ==1){
      //   return;
      // }

    
    users.update().then (()=>{

      let UID = rfid.readCards();
      //mode 1, no UID
      if (!UID){
        if(UID != lastSeen && !progmode) {
          lastSeen = UID;
          console.log("Insert Card");
          hw.mode = 'idle';
        }
        return;
      } else if(UID != lastSeen){
        lastSeen = UID;
        let isAdmin;
        console.log(UID);
        await sheet.isAdmin(UID).then((result)=>{
          console.log(result + users[UID][admin]);
          isAdmin = result;
        })
        //mode 2, admin needs to include and switch is on
        if (isAdmin && hw.switch == 1){
          hw.mode = 'program';
          progmode = true;
          console.log('Entered Programming Mode.. please input user card after 3 seconds');
          console.log ('Note: Programming mode will end in 30 seconds from now.');
          setTimeout(()=>{ progmode = false;}, 30000);
        }else if(progmode && !isAdmin){   // case 3 adding a user
          await addUser(UID);
        } else{ // case 4 check access needs to include an if statement for admin
          let access;
          await sheet.hasAccess(UID,devNum).then((result)=>{
            access = result;
          })
          let isAdminPresent;
          await sheet.isAdminPresent().then((result)=>{
            isAdminPresent =  result.data.values[0][0];
          })

          if ((sheet.isUser(UID) && access && isAdminPresent == 1 && hw.switch == 0)|| isAdmin){
            hw.mode = 'enable';
          } else if (sheet.isUser(UID) && access){
            console.log("Please ask admin to be present");
            hw.mode = 'idle';
            console.log("Please ask admin to be present");
          } else if (sheet.isUser(UID) && !access){
            hw.mode = 'noPerms';
          } else {
            console.log("User doesn't exist.");
            hw.mode = 'idle'
            return;
          }
        }
      }

    })
    }), 1000);
  // }
  // loop();
}
async function addUser(UID){
  console.log("Initiating add user");
    sheet.addUser(UID,devNum,devName).then(()=>{
      progmode = false;
      hw.mode = 'idle';
      clearInterval(loop);
    });
  }
