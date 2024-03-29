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
                        var emailVerified = (userch.child('emailVerify').val() === true)
                        console.log(emailVerified);
                        if(emailVerified)
                        {
                            resolve({
                                "emailVerified":true
                            });
                        } else {
                            resolve({
                                "emailVerified":false
                            });
                        }
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

exports.SendEmail = (params) => {
    let uid = params.uid;
    let email = params.email;
    return new Promise((resolve,reject) => {
        const request = new XMLHttpRequest();
        const url = `uid=${encodeURI(uid)}&` +
                    `email=${encodeURI(email)}`;
        request.open('POST', `/verifyEmail?${url}`, true);
        request.send();

        request.onreadystatechange = event => {
            if (request.readyState === 4 && request.status === 200) {
                let response = JSON.parse(request.response);
                console.log(response);
                if(response.state === "SUCCESS")
                {
                    resolve({
                        "state":true
                    });
                } 
                else
                {
                    resolve({
                        "state":false
                    });
                }
            }
        };
    })
}


exports.ListenVerification = (uid) => {
    console.log("On Update"); 
    return new Promise((resolve,reject) => {
       const request = new XMLHttpRequest();
       const url = `uid=${encodeURI(uid)}`;
       request.open('POST',`/listenVerification?${url}`,true);
       request.send();
        
       request.onreadystatechange = event => {
            if (request.readyState === 4 && request.status === 200) {
                let response = JSON.parse(request.response);
                console.log(response);
                if(response.state === "SUCCESS")
                {
                    resolve({
                        "state":true
                    });
                } 
                else
                {
                    resolve({
                        "state":false
                    });
                }
            }
        };

    });
    
}