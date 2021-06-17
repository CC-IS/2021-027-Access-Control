class read{
    constructor(){
        // const SoftSPI = require("rpi-softspi");

        this.Mfrc522 = require("../index");
        this.SoftSPI = require("rpi-softspi");
        this.softSPI = new this.SoftSPI({
            clock: 23, // pin number of SCLK
            mosi: 19, // pin number of MOSI
            miso: 21, // pin number of MISO
            client: 24 // pin number of CS
        });
        this.mfrc522 = new this.Mfrc522(this.softSPI).setResetPin(22).setBuzzerPin(18);
    }

    readCards(){
        this.mfrc522.reset();
        //# Scan for cards
        let response = this.mfrc522.findCard();

        if (!response.status) {
        // console.log("No Card");
        // control.stopMachine();
        return false;
        }
        //# Get the UID of the card
        response = this.mfrc522.getUid();
        if (!response.status) {
        // console.log("UID Scan Error");
        // control.stopMachine();
        return false;
        }
        //# If we have the UID, continue
        const uid = response.data;
        let UID = '' + uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16)+ uid[3].toString(16);
        return UID;
    }

}

exports.readClass = read;
