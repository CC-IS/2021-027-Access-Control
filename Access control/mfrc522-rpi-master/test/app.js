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

main ();
const loop = function (result){
  setInterval( ( async function() {
    // terminateID = intervalID;
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
      addUser(UID);
    } 
    else{
      
    let found = sheet.foundUser(result.values, UID);
    if (found[0]){
      await sheet.getRow(found[1]).then((result)=>{
             access = (result.data.values[0][devNum]);
            if (access==1){
              control.runMachine();
            }
            else{
              control.stopMachine();
            }
            })
    }
    else {
      console.log(result.data.values);
      console.log("User doesn't exist.");
      return;
    }
    
    }

  }),2000)
}

function main(){
  sheet.getUsers().then((result)=>{
    // console.log(result.data);
    loop(result.data);
  })
}

async function addUser(UID){
  console.log("Initiating add user");
    sheet.addUser(UID,devNum,devName).then(()=>{
      progmode = false;
      clearInterval(loop);
      // main();
    });
  }
  