//author @adil

//author @adil

const CouponsData = require('./Database').firebase.database();
const voucher_codes = require('voucher-code-generator');

exports.generateCoupons = function(params)
{
    var len = params.len;
    var count = params.count;
    var pattern = params.pattern;

    //pattern = pattern.replace(/1/g,'#');

    return new Promise((resolve,reject)=>{
        var coupons = voucher_codes.generate({
            length:len,
            count:count,
            prefix:"AMP-",
            pattern: '####-####',
            charset:"0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ"
        });

        if(coupons!==null) {
            
            coupons.forEach(coupon => {
                let cid = generateCID();
                CouponsData.ref('coupons/cid-' + cid).set({
                    "addedOn": getDateTime(),
                    "code" : coupon,
                    "amount" : 20,
                    "expireDate" : null,
                    "isActive" : true,
                    "isDeleted": false
                });
            });
            resolve({
                "success": true,
                "coupons": coupons
            });
        }
        else {
            resolve({ "success":false });
        }

    });
}

exports.generateSelfCoupon = function(params)
{
    let coupon = params.coupon;

    return new Promise((resolve,reject)=>{
        let cid = generateCID();
        CouponsData.ref().child('coupons').orderByChild('code').equalTo(coupon).limitToFirst(1).once('value',(couponres)=>{
            console.log(couponres.val());
            if(couponres.val() === null)
            {
                CouponsData.ref('coupons/cid-' + cid).set({
                    "addedOn": getDateTime(),
                    "code" : coupon,
                    "amount" : 20,
                    "expireDate" : null,
                    "isActive" : true,
                    "isDeleted": false
                });
                resolve({
                    'success':true
                });
            } 
            else
            {
                resolve({
                    'success':false
                });
            }
        });      
        
    });

}

exports.validateCoupon = function(params)
{
    let promoCode = params.code;

    return new Promise((resolve,reject)=>{

        CouponsData.ref().child('coupons').orderByChild('code').equalTo(promoCode).limitToFirst(1)
        .once('value').then((coupons)=>{
            if (coupons.val()!==null)
            {
                var coupon = coupons.val();
                var key;
                for(var field in coupon){
                    key = field;
                }
                var code = coupon[key]['code'];
                var amount = coupon[key]['amount'];

                resolve({
                    "success": true,
                    "promoCode":code,
                    "amount":amount
                });
            }
            else
            {
                resolve({
                    "success":false,
                })
            }
        });
    });
}

//====================================================================================//

function getDateTime() {
    var date = new Date();

    var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var year = date.getFullYear();
    var month = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    return ( `${hour}:${min}:${sec} ${day}/${month}/${year}`);
}

function generateCID() {
    var userId = "";
    var date = new Date();

    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var mon = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    var dateOrder = [ mon, day, min, sec ];

        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2)].toString(); 
        }
        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2 + 2)].toString(); 
        }

    // if(){

    // } else {
        return userId;
    //}
}