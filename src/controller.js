var {serialParser} = require('./serialParser.js');
var EventEmitter = require('events');

const READY = 1;
const SWITCH_STATE = 2;
const IP_ADDRESS = 3;
const MODE = 4;
const E_STOPPED = 5;

var modes = {
  enable: 1,
  idle: 2,
  program: 3,
  wait: 4,
  noPerms: 5
}

class HardwareControl extends EventEmitter{
  constructor(conf) {
    super();
    var _this = this;
    _this.parser = new serialParser();

    _this.config = {
    };

    _this.parser.on(E_STOPPED, (data)=> {
      _this.eStop = data[0];
      _this.emit('eStop');
    });

    _this.parser.on(MODE, (data)=> {
      _this.emit('mode', data[0]);
    });


    _this.parser.on(SWITCH_STATE, (data)=> {
      _this.switch = data[0];
      _this.emit('switchState', data[0]);
    });

    var readyInt;

    _this.parser.on(READY, ()=> {
      if (!_this.ready) {
        console.log('Controller ready');
        clearInterval(readyInt);
        _this.ready = true;
        _this.emit('ready');
      }
    });

    _this.whenReady = (cb)=> {
      if (_this.ready) {
        cb();
      } else {
        this.on('ready', cb);
      }
    };

    _this.parser.onOpen = ()=> {
      _this.parser.sendPacket([127, READY]);
      _this.parser.sendPacket([1,SWITCH_STATE]);
      _this.parser.sendPacket([1,E_STOPPED]);
    };

    _this.onPortNotFound = ()=>{};

    _this.portNotFound = false;

    _this.parser.serial.onPortNotFound = ()=>{
      _this.portNotFound = true;
      _this.onPortNotFound();
    }

    if (conf.name) _this.parser.setup({ name: conf.name, baud: 115200 });
    else if (conf.manufacturer) _this.parser.setup({ manufacturer: conf.manufacturer, baud: 115200 });

  }

  sendIpAddress(ip){
    var _this = this;
    var test = ip;
    var nums = test.split('.').map(el=>parseInt(el));
    var addrArr = [];
    addrArr[0] = (nums[0] & 0b11111110) >> 1;
    addrArr[1] = ((nums[0] & 0b00000001) << 6) + ((nums[1] & 0b11111100) >> 2);
    addrArr[2] = ((nums[1] & 0b00000011) << 5) + ((nums[2] & 0b11111000) >> 3);
    addrArr[3] = ((nums[2] & 0b00000111) << 4) + ((nums[3] & 0b11110000) >> 4);
    addrArr[4] = ((nums[3] & 0b00001111));
    addrArr.unshift(1, IP_ADDRESS);

    _this.parser.sendPacket(addrArr);
  }

  set mode(modeName){
    var _this = this;
    _this._mode = modeName;
    // console.log('mode is ' + modeName + ' ' + modes[modeName]);
    if(_this.ready) _this.parser.sendPacket([1, MODE, modes[modeName]]);
  }

  get mode(){
    return this._mode;
  }

  set onready(cb) {
    //this.on_load = val;
    if (this.ready) {
      cb();
    } else {
      this.on('ready', cb);
    }
  }
};

exports.HardwareControl = HardwareControl;
