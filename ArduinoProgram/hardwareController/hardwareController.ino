#include "serialParse.h"
#include "timeOut.h"
#include "Button.h"
#include "mkrSpcLogo.h"

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// declare the terms for the parser commands

enum commands {
  READY = 1,
  SWITCH_STATE,
  IP_ADDRESS,
  MODE,
  E_STOP
};

//const int READY = 1;
//const int SWITCH_STATE = 2;
//const int PROGRAMMING_MODE = 3;
//const int AUTHENTICATED = 4;
//const int E_STOP = 4;

enum modes{
  ENABLE,
  ADMIN,
  PROG,
  DISABLE,
  WAIT,
  E_STOPPED
} mode = DISABLE;

Button powSwitch;
Button eStop;

serialParser parser(Serial);

char ipAddress[7];

int notifyPin = 13;
int relayPin = 9;

void eStopText(){
 display.clearDisplay();
 display.setTextSize(2); // Normal 1:1 pixel scale
 display.setTextColor(SSD1306_WHITE); // Draw white text
 display.cp437(true); // Use full 256 char 'Code Page 437' font
 display.setCursor(0,7); // Start at top-left corner
 display.println(F("Emergency"));
 display.println(F("Stop"));
 display.println(F("Engaged"));
 display.display();
}

void splash(){
  display.clearDisplay();

  display.setCursor(0, 0);
  display.drawBitmap(
    (display.width() - LOGO_WIDTH) / 2,
    0,
    mkrLogo, LOGO_WIDTH, LOGO_HEIGHT, 1);
  display.setTextSize(1); // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); // Draw white text
  display.cp437(true); // Use full 256 char 'Code Page 437' font
  if(mode == ENABLE){
    display.setCursor(15,52); // Start at top-left corner
    display.println(F("System Enabled"));
  }
  else if(mode == PROG){
    display.setCursor(22,52); // Start at top-left corner
    display.println(F("Tap New RFID."));
  }
  display.display();
}

void writeDisplay(){
  if(mode == ENABLE){
    splash();
  } else if(mode == E_STOPPED){
    //eStopText();
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  parser.address = 1;

  pinMode(notifyPin, OUTPUT);
  pinMode(relayPin, OUTPUT);

  powSwitch.setup(3,[](int state){
    parser.sendPacket(REPORT, SWITCH_STATE, state);
    if(mode != ENABLE && !state){
      digitalWrite(notifyPin,LOW);
      digitalWrite(relayPin,LOW);
    }
  });

  eStop.setup(4,[](int state){
    parser.sendPacket(REPORT, E_STOP, state);
    mode = E_STOPPED;
  });

  parser.on(READY, [](unsigned char * input, int size){
    parser.sendPacket(REPORT,READY);
  });

  parser.on(SWITCH_STATE, [](unsigned char * input, int size){
    parser.sendPacket(REPORT, SWITCH_STATE, powSwitch.state);
  });

  parser.on(E_STOP, [](unsigned char * input, int size){
    parser.sendPacket(REPORT, E_STOP, eStop.state);
  });

  parser.on(MODE, [](unsigned char * input, int size){
    mode = input[2];
    writeDisplay();
    if(mode == ENABLE){
      digitalWrite(notifyPin,HIGH);
      digitalWrite(relayPin,HIGH);
    } else if(mode == DISABLE && !powSwitch.state){
      digitalWrite(notifyPin, LOW);
      digitalWrite(relayPin, LOW);
    }
  });

  parser.on(IP_ADDRESS, [](unsigned char * input, int size){
    ipAddress[0] = ((input[2]&0b01111111)<<1) + ((input[3]&0b01000000)>>6);
    ipAddress[1] = '.';
    ipAddress[2] = ((input[3]&0b00111111)<<2) + ((input[4]&0b01100000)>>5);
    ipAddress[3] = '.';
    ipAddress[4] = ((input[4]&0b00011111)<<3) + ((input[5]&0b01110000)>>4);
    ipAddress[5] = '.';
    ipAddress[6] = ((input[5]&0b00001111)<<4) + ((input[6]&0b00001111));
    parser.startMessage();
    for(int i=0; i<7; i++){
      if(!(i%2)) Serial.print(ipAddress[i],DEC);
      else Serial.print(ipAddress[i]);
    }
    parser.endMessage();
  });

  parser.sendPacket(REPORT,READY);

 if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3C for 128x32
   Serial.println(F("SSD1306 allocation failed"));
   for(;;); // Don't proceed, loop forever
 }
 display.ssd1306_command(0x22); // Set page start and end addresses
 display.ssd1306_command(0x00); // start at zero
 display.ssd1306_command(0x07); // end at seven.
}


void loop() {
  parser.idle();
  powSwitch.idle();
  eStop.idle();
}
