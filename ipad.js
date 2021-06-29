// require('external-ip')()(function(err, ip) {
//     if (!err) {
//         console.log(ip);
//     } else {
//         console.log(err);
//     }
// });

var interfaces = require('os').networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && address.address !== '127.0.0.1' && !address.internal){
                    addresses.push(address.address);
                }
            }
        }
        console.log(typeof( addresses[0]));