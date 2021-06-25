const config = require ('/boot/config.json');
// const config = require ('C:/Users/phyys/Desktop/config.json')
const {getDataFromSheet} = require('./src/spreadsheetChecker');
const {readClass} = require('./src/read');
const {HardwareControl} = require('./src/controller.js');
const devName = config.device;
var hw = new HardwareControl({ manufacturer: 'Arduino LLC'});
// console.log(config.spreadSheetID + config.KeyFile);
const sheet = new getDataFromSheet(config.spreadSheetID, config.KeyFile);
const rfid = new readClass();
let buffer;

hw.on('mode', (reportedMode)=>{
	// console.log(reportedMode);
})

hw.on('switchState', state=>{
	console.log(state + ' is the switch state');
})
// let lastSeen = null;
// hw.mode =='idle'
setInterval( async function() {
	sheet.update().then (()=>{
		// console.log(sheet.usrs[0].indexOf(devName));
		// sheet.addUser('this is UID','CCIS-LAT-001');
		
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
	
		if(/*UID != lastSeen && */hw.mode == 'program') {
			// lastSeen = UID;
			addUser(UID);
			return;
		} else /*if (UID != lastSeen)*/{
			// lastSeen = UID;
			if (!sheet.usersarr.includes(UID)){ console.log ("noperms no user"); hw.mode = 'noPerms'; return;}
			let user = sheet.getUser(UID);
			// console.log("user[devName]   " + user[devName]);
			// console.log("sheet.adminPresent " + sheet.adminPresent);
			// console.log("hw.swtich  " + hw.switch);

			console.log("admin: "+user['Admin'] + hw.switch);
			if (user['Admin'] == 1 && hw.switch == 1 && hw.mode != 'enable'){
				buffer = UID;
				hw.mode = 'program';
				console.log('Entered Programming Mode.. please input user card after 3 seconds');
				console.log ('Note: Programming mode will end in 30 seconds from now.');
				setTimeout(()=>{ hw.mode = 'idle';}, 30000);
			} console.log ("buffer   " + buffer + "  UID    " + UID)  else if(hw.mode == 'program' && UID != buffer){   // case 3 adding a user
				addUser(UID);
				hw.mode = 'idle';
				return;
			} else{
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
