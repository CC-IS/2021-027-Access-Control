var { HardwareControl } = require('./src/controller.js');

var hw = new HardwareControl({
  manufacturer: 'Silicon Labs'
});

hw.on('switchState', (val)=>{
  console.log(val);
})

hw.on('eStop', (val)=>{
  console.log(val);
})

hw.onready = ()=>{
  hw.mode = 'program';

  setTimeout(()=>{
    hw.mode = 'enable';
    hw.sendIpAddress('10.120.10.120');
  }, 2000);
}
