require('external-ip')()(function(err, ip) {
    if (!err) {
        console.log(ip);
    } else {
        console.log(err);
    }
});