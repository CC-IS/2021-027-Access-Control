class display {
    constructor(){
        var i2c = require('i2c-bus'),
        i2cBus = i2c.openSync(1),
        oled = require('oled-i2c-bus');
      
        var opts = {
            width: 128,
            height: 64,
            address: 0x3D
        };
        var oled = new oled(i2cBus, opts);
        oled.clearDisplay();

    }
    test(){

        if(!oled.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
            console.log(F("SSD1306 allocation failed"));
            for(;;);
          }
          delay(2000);
          oled.clearDisplay();
        
          oled.setTextSize(1);
          oled.setTextColor(WHITE);
          oled.setCursor(0, 10);
          // Display static text
          oled.println(", world!");
          oled.display(); 
          delay(2000);
          oled.clearDisplay();
        
          
          Serial.begin(115200);    
    }
}
exports.display = display;