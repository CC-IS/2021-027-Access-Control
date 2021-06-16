const Mfrc522 = require("./../index");
const SoftSPI = require("rpi-softspi");
const check = require('./spreadsheetChecker');
const sleep = function (x){
  setTimeout(()=>{
  null;
},x)
}
const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
});
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

const loop = function (){
  setInterval(function() {
    mfrc522.reset();
    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      //console.log("No Card");
      console.log("no card");
      return;
    }
    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      console.log("UID Scan Error");
      return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    let UID = '' + uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16)+ uid[3].toString(16);  
    console.log(UID);
    if (UID =="ff83aa29"){
      console.log("first one detected!")
    }
  },2000)
}

check.getDataFromSheet().then((result)=>{
  
  loop();
  

  // console.log( result.values );
  //loop -> while value isn't included -> power off
  //if value is included -> power on + write in sheet 2 which the ID + 
  // register time first read and last read and put the this time. 
  // 
})


//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
// console.log("scanning...");
// console.log("Please put chip or keycard in the antenna inductive zone!");
// console.log("Press Ctrl-C to stop.");

// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
/*
const loop = function (){
  setInterval(function() {
  //# reset card
  mfrc522.reset();

  //# Scan for cards
  let response = mfrc522.findCard();
  if (!response.status) {
    //console.log("No Card");
    return;
  }
  //console.log("Card detected, CardType: " + response.bitSize);

  //# Get the UID of the card
  response = mfrc522.getUid();
  if (!response.status) {
    console.log("UID Scan Error");
    return;
  }
  //# If we have the UID, continue
  const uid = response.data;
  // console.log(
  //   "Card read UID: %s %s %s %s",
  //   uid[0].toString(16),
  //   uid[1].toString(16),
  //   uid[2].toString(16),
  //   uid[3].toString(16)
    
  // );

  //# Select the scanned card
  // const memoryCapacity = mfrc522.selectCard(uid);
  // console.log("Card Memory Capacity: " + memoryCapacity);

  //# This is the default key for authentication
  //const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

  // //# Authenticate on Block 8 with key and uid
  // if (!mfrc522.authenticate(8, key, uid)) {
  //   console.log("Authentication Error");
  //   return;
  // }

  //# Dump Block 8
  //console.log("Block: 8 Data: " + mfrc522.getDataForBlock(8));

  //# Stop
  return uid[0]+uid[1]+uid[2]+uid[3];
  mfrc522.stopCrypto();
}, 500);*/


