exports.ResendEmail = (phone) =>{
    return new Promise((resolve,reject)=>{
        resolve();
    })
}

exports.CheckForEmail = (params) =>{
    const UserData = require('./Database').firebase.database();
    return new Promise((resolve,reject)=>{
        UserData.ref().child('users').orderByChild('uid').equalTo(params.uid).limitToFirst(1).once('child_added',(userch,err)=>{
                if(userch.val() !== null)
                {
                    var addEmail = (userch.child('email').val() === null )
                    if(addEmail)
                    {
                        resolve({
                            "addEmail":addEmail
                        });
                    } else {
                        var emailVerify = (userch.child('emailVerify').val() === true)
                        resolve({
                            "emailVerify":emailVerify
                        });
                    }
                      
                }
                
            });
    }).catch((err) => {
            console.log("HERE IN ERROR");
            console.log(err);
    });
}

exports.AddEmail = (params) => {
    const UserData = require('./Database').firebase.database();
    let email = params.email;
    let uid = params.uid;
    console.log(params);
    return new Promise((resolve,reject) => {
        UserData.ref().child('users').orderByChild('uid').equalTo(uid).limitToFirst(1).once('child_added',(userch,err)=>{
            console.log(userch.val());
            if(userch.val() !== null)
            {
                UserData.ref('users/user-' + uid ).update({
                    "email" : email,
                    "emailVerify" : false
                });
                resolve({
                    "success":true
                }); 
            } else {
                resolve({
                    "success" : false
                })  
            }
            
        });
        }).catch((err) => {
            console.log("HERE IN ERROR");
            console.log(err);
    });
}