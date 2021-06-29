const config = require ('/boot/config.json');
// const config = require ('C:/Users/phyys/Desktop/config.json')
const {getDataFromSheet} = require('./src/spreadsheetChecker');
const {readClass} = require('./src/read');
const {HardwareControl} = require('./src/controller.js');
const devName = config.device;
var hw = new HardwareControl({ manufacturer: 'Arduino LLC'});
const sheet = new getDataFromSheet(config.spreadSheetID, config.KeyFile);
const rfid = new readClass();
let buffer;

hw.on('mode', (reportedMode)=>{
	console.log(reportedMode);
})

hw.on('switchState', state=>{
	console.log(state + ' is the switch state');
})
setInterval( async function() {
	sheet.update().then (()=>{
		console.log(getIPAddress());
		// hw.sendIpAddress(getIPAddress());
		
		let UID = rfid.readCards();
		
		if (!UID){
			if (hw.switch == 1 && hw.mode == 'enable'){
				return
			}
			else if (hw.mode =='idle') return;
			else if (hw.mode == 'program'){return;}
			else {hw.mode = 'idle'; return;}
		}
		console.log(UID);
	
		if(hw.mode == 'program' && UID != buffer ) {
			console.log ("buffer   " + buffer + "  UID    " + UID) ;
				addUser(UID);
				hw.mode = 'idle';
				return;
		} else{
			if (!sheet.usersarr.includes(UID)){ console.log ("noperms no user"); hw.mode = 'noPerms'; return;}
			let user = sheet.getUser(UID);
			if (user['Admin'] == 1 && hw.switch == 1 && hw.mode != 'enable'){
				buffer = UID;
				hw.mode = 'program';
				console.log('Entered Programming Mode.. please input user card after 3 seconds');
				console.log ('Note: Programming mode will end in 30 seconds from now.');
				setTimeout(()=>{ hw.mode = 'idle';}, 30000);
			}else{
				if (( (user[devName] ==1 && sheet.adminPresent == 1 && hw.switch == 0 )|| user['Admin'] ==1) && hw.mode !='enable'){
					hw.mode = 'enable';
				} else if (sheet.adminPresent == 0){
					console.log("Please ask admin to be present");
					hw.mode = 'idle';
				} else if (user[devName] ==0){
					hw.mode = 'noPerms';
				} 
			}
		}
	})
},1000)


async function addUser(UID){
	console.log("Initiating add user");
		sheet.addUser(UID,devName).then(()=>{
			hw.mode = 'idle';
		});
	}

function getIPAddress(){
	var interfaces = require('os').networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && address.address !== '127.0.0.1' && !address.internal && address.address.includes('10.133')){
                    addresses.push(address.address);
                }
            }
        }
        return addresses[0];
}