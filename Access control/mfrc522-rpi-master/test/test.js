const {read} = require('./read');
const test = new read();

setInterval(() => {
    console.log (test.readCards());    
}, 2000);
