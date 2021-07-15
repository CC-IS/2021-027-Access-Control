# Access control program for the instrument shop

**Requirements:**
1- Raspberrypi 3 and above. Make sure it includes on-board wifi. We used the raspberry pi zero, for it has smaller form factor.
2- SPI RFID ID reader. We used RC522.
3- Breadboard
4- Jumper wires
5- Arduino board. We used arduino nano, for it has smaller form factor.
6- Screen. We used SSD1306, for it is cheap and small.
7- On/off switch
8- E-Stop
9- 8 GB or above sd card for storing the OS for the raspberrypi


**Installing the OS on the raspberry Pi**
1- insert the sd-card into your computer and download and run [Raspberry Pi OS manager] (https://www.raspberrypi.org/software/)
2- Run the OS image manager   in the OS choose Raspberry PI OS (other) -> Raspberry Pi Lite (32b-bit)
                              in the storage option, choose the sd-card you inserted. Make sure that it's empty or everything will be deleted. 
                              If you're running windows machine and you have controlled access feature enabled, make sure to allow the program to write on the external storage.
                              Windows thinks it is unauthorized access and stops it.
3- Click write to write the Raspberry Pi image into the sd card.
4- when the program finishes, transfer sd-card to your raspberry pi. 
5- connect pi to an external display and keyboard, and power the it.
6- Log in to the Pi with default credentials. username: pi password: raspberry
7-connect the Pi to the internet, if you're using Carleton network, you can find more information [here](http://makerbase.wikidot.com/howto:raspberry-pi).


**Importing the project**
1- install git using the following command
sudo apt install git -y
2- run the following command to import the project 
git clone https://github.com/CC-IS/2021-027-Access-Control/
3- Install NodeJs for your board, you can know your system architecture by running uname -m. For the raspberry Pi Zero, we found [this](https://gist.github.com/davps/6c6e0ba59d023a9e3963cea4ad0fb516) tutorial to be helpful.
4- change directory into ./2021-027-Access-Control
5- run npm i to install the dependancies.
6- Create a [google service account] (https://support.google.com/a/answer/7378726?hl=en) and enable the google sheets API in it.
7- Download the Credentials in .Json file and keep them in a safe place (Don't upload them to github).
8- Create a google sheet and give the service account you made access to it.
9- Create a config.json file with the following attributes
"device": the name of the device the pi you're using is going to connect to, it should be one of the cells in the first row of your google sheet.
"spreadSheetID" : the spreadsheet ID which comes after https://docs.google.com/spreadsheets/ in your address bar.
"KeyFile" : the path to the Credentials file, we suggest it to be /boot/Credentials.Json because you can easily transfer the Credentials to the boot directory from your computer.
"sheetName" : the name of the subsheet if you are using the default sheet name should be "Sheet1"
10- Move both the config.json file and the Credentials.Json files to your boot directory. 
