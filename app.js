var { HardwareControl } = require('./src/controller.js');

var hw = new HardwareControl({
  manufacturer: 'Silicon Labs'
});

hw.on('switchState', (val)=>{
  console.log(val);
})

hw.onready = ()=>{
  hw.mode = 'program';

  setTimeout(()=>{
    hw.mode = 'enable';
    hw.sendIpAddress();
  }, 2000);
}
