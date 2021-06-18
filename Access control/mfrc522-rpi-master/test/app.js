const {getDataFromSheet} = require('./spreadsheetChecker');
const {readClass} = require('./read');
const control = require('./controllingMachine');
const devName="CCIS-VBS-001";
let access =0;
let adminUIDs =["c66759a5"];
const sheet = new getDataFromSheet();
let devNum = 0;
sheet.getDevNum(devName).then ((value)=>{devNum = value});
const rfid = new readClass();
let progmode = false;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const loop = function (result){
  setInterval( async function() {
  
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
      console.log("User doesn't exist.");
      return;
    }
    
    }

  },2000)
}

sheet.getUsers().then((result)=>{
  loop(result.data);
})

async function addUser(UID){
  console.log("Initiating add user");
  // progmode= true;
  //  let UIDRead = await rfid.readCards();
    sheet.addUser(UID,devNum,devName).then(()=>{
      // sheet = new getDataFromSheet();
      progmode = false;
      console.log(result.data.values);
    });
  }
  