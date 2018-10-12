/*const SMSConfig = require('../config.json').smsService;
const http = require('http');
const qs = require('querystring');

exports.SendSMSSessionOTP = (otp, phone, sender) => {
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": "/API/V1/" + SMSConfig.apikey + "/SMS/" + phone + "/" + otp + "/" + sender,
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        }
    };
      
    return new Promise((resolve,reject)=>{
        var req = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) { chunks.push(chunk) });
            
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        
        req.write(qs.stringify({}));
        req.end();
        resolve();
    });
}
*/
const client = require('twilio')('ACa7ddf72898846fbf0222e5bfe5f8779a','0cfee3e9d4c46eb240b191183a733783')

exports.SendSMSSessionOTP = (otp, phone) => {
    return new Promise((resolve,reject)=>{
        client.sendMessage({
            to:phone,
            from: '+18508058852',
            body:'Amphere Beta Solutions,your session otp :' +otp
        },function(err,data){
            if(err)
                console.log(err);
        });
    });
}