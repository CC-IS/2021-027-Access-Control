const Mfrc522 = require("./../index");
const SoftSPI = require("rpi-softspi");
const {getDataFromSheet} = require('./spreadsheetChecker');
const control = require('./controllingMachine');
// const config = require ('/boot/config/setup.json');
const devName="CCIS-HBS-001";
let access =0;
let devNum = 1;
const data = new getDataFromSheet();

const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
});
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

async function getDevNum(name){
  let returnedValue = 0;
  await data.getRow(-1).then((rowData)=>{    
    returnedValue = (rowData.data.values[0].indexOf(name)); 
  })
  return returnedValue;
}
getDevNum(devName).then((value)=>{
  devNum = value;
})

const loop = function (result){
  setInterval( async function() {
    
    mfrc522.reset();
    //# Scan for cards
    let response = mfrc522.findCard();

    if (!response.status) {
      //console.log("No Card");
      // control.stopMachine();
      // return;
    }
    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      // console.log("UID Scan Error");
      // control.stopMachine();
      // return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    // let UID = '' + uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16)+ uid[3].toString(16);
    // let found = false;
    let UID = 'ff83aa29';

    let found = data.foundUser(result.values, UID);
    //console.log(found);
    if (found[0]){
      let index = found[1];
      let pullingAccess = await data.getRow(index).then((result)=>{
             access = (result.data.values[0][devNum]);
            //  console.log("after setting the value"); 
            })
    }
    else {
      control.stopMachine();
    }
    
    if (access==1){
      control.runMachine();
    }
    else{
      control.stopMachine();
    }
    
    // }
    // result.values.forEach(Element => {
    //   if (Element.includes(UID)){
    //     let index = result.values.indexOf(Element);
    //     data.getRow(index).then((result)=>{
    //     console.log(result.data.values[0][devNum]);
    //     })
    //     control.runMachine();
    //     found = true;
    //   }
    // });
    // if (!found){
    //   control.noAccess();
    // }


    
  },1000)
}

data.getUsers().then((result)=>{
  loop(result.data);
})
