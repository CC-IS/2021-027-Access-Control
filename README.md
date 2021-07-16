# Access control program
This is a program that uses RFID cards to allow access to machines at the shop. We are Raspberry Pi zero and Arduino micro pro to control separate parts.  
The Pi controls reading the RFID, connection with the cloud mfrc522, and basic logic.
The Arduino drives the screen, controls the relays, connects to switches and e-stops, and adds the ability to add extra functionality due to its analog pins. 

## Requirements

1- Raspberry Pi 3 and above. Make sure it includes on-board Wi-Fi. We used the raspberry pi zero, for it has smaller form factor.
2- SPI RFID ID reader. We used RC522.
3- Breadboard
4- Jumper wires
5- Arduino board. We used Arduino micro pro, for it has smaller form factor.
6- Screen. We used SSD1306, for it is cheap and small.
7- On/off switch
8- E-Stop
9- 8 GB or above SD-card for storing the OS for the raspberry Pi

## Installing the OS on the Pi

 1. Insert the SD-card into your computer and download and run
    [Raspberry Pi OS manager](https://www.raspberrypi.org/software/)
    
 2. Run the OS image manager

 3.  OS choose **Raspberry PI OS (other)** then choose **Raspberry Pi
        Lite (32b-bit)**
        
 4.  In the storage option, choose the SD-card you inserted.  Make sure that it's **empty** or everything will be deleted.

    Troubleshooting: If you're running windows machine and you have controlled access feature enabled, make sure to allow the program to write on the external storage. Windows thinks it is unauthorized access and stops it.
    
 5.  Click write to write the Raspberry Pi image into the sd card. 

 6.  When the program finishes, transfer sd-card to your raspberry pi.

 7. connect pi to an external display and keyboard, and power the it.

 8. Log in to the Pi with default credentials. username: pi password:
    raspberry 7-connect the Pi to the internet, if you're using Carleton
    network, you can find more information [here](http://makerbase.wikidot.com/howto:raspberry-pi).

## Importing the project
1. Install git using the following command:

    >sudo apt install git -y
2.  Run the following command to import the project

    >git clone https://github.com/CC-IS/2021-027-Access-Control/

3. Install NodeJS for your board, you can know your system architecture by running `uname -m`. For the raspberry Pi Zero, we found [this](https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/) tutorial to be helpful.

4. change directory to the project folder using  `cd ./2021-027-Access-Control`

5. run `npm i` to install the dependencies.

6. Create a [google service account](https://support.google.com/a/answer/7378726?hl=en) and enable the google sheets API in it.

7. Download the Credentials in .Json file and keep them in a safe place. **Warning: Don't upload them to GitHub!**

8. Create a [google sheet](https://spreadsheet.new/) and give the service account you made access to it.

9. Create a `config.json` file with the following attributes

        "spreadSheetID" : the spreadsheet ID which comes after https://docs.google.com/spreadsheets/ in your address bar.
        
        "device": the name of the device the pi you're using is going to connect to, it should be one of the cells in the first row of your google sheet.
        
        "KeyFile" : the path to the Credentials file, we suggest it to be /boot/Credentials.Json because you can easily transfer the Credentials to the boot directory from your computer.
        
        "sheetName" : the name of the subsheet if you are using the default sheet name should be "Sheet1"
    An example would be:
       
        {
        
        "spreadSheetID" : "1k3eZkkqm1bWA3lk8gUgfoR6Xpb2vVaX4iaqnizi5iDc",
        
        "device": "CCIS-LAT-001",
        
        "KeyFile" : "/boot/Credentials.json",
        
        "sheetName" : "Authorizations"
        
        }
10. Move both the `config.json` file and the `Credentials.Json` files to your boot directory.

## Setting up the Arudino


1. Make sure you have the Arduino enrironment setup from [here](https://www.arduino.cc/en/software)
2. Open the ArduinoProgram/hardwareController folder from this repo.
3. open `hardwareController.ino` using the Arduino IDE, connect the arduino to your computer, from the tools drop down menu, select the port and board type and upload the code to the arduino.


## Hardware Configuration
![Circuit Diagram](https://github.com/CC-IS/2021-027-Access-Control/blob/main/resources/Circuit%20diagram.JPEG?raw=true)

| mfrc522 | Raspberry Pi Pin | 
|--|--|
| vcc | 1 |
| RST | 22 |
| GND | 6 |
| MISO | 21 |
| MOSI | 19 |
| SCK | 23 |
| SDA | 24 |
| IRQ| **-** | 


| SSD1306| Arduino Pin | 
|--|--|
| VCC | VCC |
| GND | GND |
| SCL | 3 |
| SDA | 4 |

| Raspberry Pi Pin | Arduino Pin | 
|--|--|
| 8 | RX |
| 10 | TX |

	

| device | Arduino Pin
|--|--|
| E-Stop| 5 (See diagram)|
| Switch | 4 (See diagram) |

