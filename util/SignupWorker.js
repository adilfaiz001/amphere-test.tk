/**
 * @author Alisamar Husain
 * 
 * Signup User Service API
 * -----------------------
 * Send user parameters to
 * the server as HTTP request
 * and this function registers
 * the user.
 * 
 * @param phone {}
 * @param name {}
 * @param password {}
 * @param verification
 */

const Hasher = require('./PasswordHasher');
const firebaseSignup = require('./Database');
const CouponsData = require('./Database').firebase.database();
const UsersData = require('./Database').firebase.database();
const SpreadsheetWorker = require('./SpreadsheetWorker');
const ssConfig = require('../config.json');
const nodemailer = require('nodemailer');
const async = require('async');
const functions = require('firebase-functions');

exports.CreateNewUser = function (params) {

    var usersData = firebaseSignup.firebase.database();

    let salt = generateSalt(12);
    let uid = generateUserId();
    let hash = Hasher.generateHash(params.password, salt);

    return new Promise((resolve,reject) => {

        usersData.ref().child('users').orderByChild('phone').equalTo(params.phone).once('value', (searchres)=>{
            
            if(searchres.val()===null)
            {
                usersData.ref().child('users').orderByChild('email').equalTo(params.email).once('value',(user)=>{
                    if (user.val()===null)
                    {
                        usersData.ref('users/user-' + uid).set({
                            "uid" : uid,
                            "phone" : params.phone,
                            "email" : params.email,
                            "emailVerify" : false,
                            "name" : decodeURI(params.name),
                            "salt" : salt,
                            "password" : hash,
                            "addedOn" : getDateTime(),
                            "isDeleted" : false,
                            "login" : true
                        });
                        /*.then(()=>{
                            SpreadsheetWorker.WriteToSpreadsheet({
                                "ssId" : ssConfig.spreadsheets.records,
                                "sheet" : "Users",
                                "values" : [
                                    `${getDateTime()}`,
                                    `${uid}`,
                                    `${decodeURI(params.name)}`,
                                    `${params.phone}`
                                ]
                            });
                            resolve({
                                "success" : true,
                                "uid" : uid,
                                "hash" : hash
                            });
                        });*/
                        CouponsData.ref().child('coupons').orderByChild('user').equalTo('general').on('value',(coupons)=>{
                            if(coupons.val() !== null)
                            {
                                var Coupons = coupons.val();
                                for(key in Coupons){
                                    var coupon = Coupons[key]['code'];
                                    UsersData.ref('users/user-' + uid + '/coupons').update({
                                        [coupon]:3
                                    });
                                }
                            }
                        });
                        resolve({
                            "success" : true,
                            "uid" : uid,
                            "hash" : hash
                        });
                    } else {
                        resolve({
                            "success" : false,
                            "error" : "EMAIL-EXIST"
                        });
                    }
                });  
            }else {
                resolve({
                    "success" : false,
                    "error" : "PHONE-EXISTS"
                });
            }
        });
    });
}

exports.EmailVerification = (req,res) =>{
        async.waterfall([
            function(done) {
                let uid;
                let phone = getParameters(req).phone;
                UsersData.ref().child('users').orderByChild('phone').equalTo(phone).limitToFirst(1).once('child_added',(UserUid)=>{
                    uid = UserUid.child('uid').val();
                });
                console.log("UID:" + uid);
                let UserIdHash = Hasher.generateUserIdHash(uid);
                done(null,uid,UserIdHash);
            },
            function(uid,UserIdHash,done){
                UsersData.ref("users/user-" + uid).update({
                    "userIdToken" : UserIdHash
                });
                let params = getParameters(req);
                let email = params.email;
                console.log("Email:" + email);
                done(null,uid,email,UserIdHash);
            },
            function(uid,email,UserIdHash,done){
                console.log("Email and UserId:"+email+UserIdHash);
                let url = `http://amphere-test.tk/confirm_email/${UserIdHash}`;
                let params = getParameters(req);

                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                    user: 'amphere.solutions@gmail.com',
                    pass: 'ArpitGujjar@123'
                    }
                });

                var mailOptions = {
                    to: email,
                    from: 'amphere.solutions@gmail.com',
                    subject: 'amphere-solutions email verification',
                    text: 'You signed up for amphere solutions.\n\n' +
                    'Please click on the following link, or paste this into your browser to verify your identity of this email address:\n\n' +
                    url + '\n\n' +
                    'Thank Your.\n'
                };
                smtpTransport.sendMail(mailOptions,function(err){
                    console.log('mail sent');
                    /*
                    console.log(`\nNEW USER ADDED => \n\t- name: ${params.name} \n\t- phone: ${params.phone}`)
                    req.flash('success','An email has been sent to '+email+' for verification.');
                    console.log("Flash:"+req.flash('success'));
                    */     
                    done(err,uid,email);
                });
        },
        function(uid,email,done){
            console.log("Last In Asyn")
            let params = getParameters(req);
            res.status(200).json({
                "state" : "SUCCESS",
                "uid" : uid,
                "hash" : params.hash,
                "email" : email,
                "mailSent":true
            });
            console.log(`\nNEW USER ADDED => \n\t- name: ${params.name} \n\t- phone: ${params.phone}`); 
            done(err,'done');
        }
    ],function(err){
        res.redirect('/signup');
    });
}

exports.AccountEmailVerification = (req,res) => {
    let params = getParameters(req);
    let uid = decodeURI(params.uid);
    let email = decodeURI(params.email);
    async.waterfall([
        function(done) {
            console.log("UID:" + uid);
            let UserIdHash = Hasher.generateUserIdHash(uid);
            done(null,uid,UserIdHash);
        },
        function(uid,UserIdHash,done){
            UsersData.ref("users/user-" + uid).update({
                "userIdToken" : UserIdHash
            });
            done(null,uid,email,UserIdHash);
        },
        function(uid,email,UserIdHash,done){
            let url = `http://amphere-test.tk/confirm_email/${UserIdHash}`;
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                user: 'amphere.solutions@gmail.com',
                pass: 'ArpitGujjar@123'
                }
            });

            var mailOptions = {
                to: email,
                from: 'amphere.solutions@gmail.com',
                subject: 'amphere-solutions email verification',
                text: 'This is email verification for amphere solutions.\n\n' +
                'Please click on the following link, or paste this into your browser to verify your identity of this email address:\n\n' +
                url + '\n\n' +
                'Thank You.\n'
            };
            smtpTransport.sendMail(mailOptions,function(err){
                console.log('mail sent');
                res.status(200).json({
                    "state" : "SUCCESS",
                    "mailSent":true
                });  
                done(err,'done');
            });
        }
    ],function(err){
        console.log(err);
    });
}

exports.ConfirmEmail = (params) => {
    let UserIdHash = params.UserIdHash;
    console.log("Confirm Mail");
    return new Promise((resolve,reject)=>{
        UsersData.ref().child('users').orderByChild('userIdToken').equalTo(UserIdHash).limitToFirst(1).once('child_added',(userch)=>{
            console.log(userch.val());
            if(userch.val() !== null)
            {
                UsersData.ref('users/user-' + userch.child('uid').val()).update({
                    "emailVerify":true,
                    "userIdToken" : null
                }).then(()=>{
                    resolve({
                        "success" : true
                    });
                });
            } else{
                resolve({
                    "success" : false
                });
            }
        });
    });
}

exports.ListenVerification = (params) => {
    let uid = params.uid;
    return new Promise((resolve,reject) => {
        console.log(params);
        const state = functions.database().ref('users/user-'+uid+'emailVerify').onUpdate((change,context)=>{
            return change.after.val();
        });
        console.log(state);
        if(state)
        {
            resolve({
                "success":true
            });
        } else {
            resolve({
                "success":false
            });
        }
    });
}

//==============================================================================================//
//-------------------------------------- UTILITY FUNCTIONS -------------------------------------//
//==============================================================================================//

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

function generateUserId() {
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

function generateSalt(length) {
    var salt = "";
    for(var i=0 ; i<length ; i++){
        salt = salt + Math.floor(Math.random()*16).toString(16);
    }
    return salt;
}

function getParameters(request){
    url = request.url.split('?');
    var query = {
        "action" : url[0]
    };
    if(url.length>=2){
        url[1].split('&').forEach((q)=>{
            try{
                query[q.split('=')[0]] = q.split('=')[1];
            } catch(e) {
                query[q.split('=')[0]] = '';
            }
        })
    }
    return query;
}