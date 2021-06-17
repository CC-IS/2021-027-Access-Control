const {getDataFromSheet} = require('./spreadsheetChecker');
const {readClass} = require('./read');
const control = require('./controllingMachine');
const devName="CCIS-HBS-001";
let access =0;
let adminUIDs =["c66759a5"];
let progmode = false;
const sheet = new getDataFromSheet();
let devNum = 0;
sheet.getDevNum(devName).then ((value)=>{devNum = value});
const read = new readClass();


const loop = function (result){
  setInterval( async function() {

    let UID = read.readCards();
    // console.log('UID is: ' + UID);
    if (!UID){
      control.stopMachine();
      return;
    }
    let UID2bAdded = 0;
    if (adminUIDs.includes(UID)){
      progmode = true;
      console.log('Entered Programming Mode');
      UID2bAdded =read.read2bAddedUser();
      sheet.addUser(UID2bAdded,devNum);
      
    }
    let found = sheet.foundUser(result.values, UID);
    if (found[0]){
      let index = found[1];
      await sheet.getRow(index).then((result)=>{
             access = (result.data.values[0][devNum]);
            })
    }
    else {
      control.stopMachine();
      return;
    }
    
    if (access==1){
      control.runMachine();
    }
    else{
      control.stopMachine();
    }
  },2000)
}

sheet.getUsers().then((result)=>{
  loop(result.data);
})
