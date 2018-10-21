exports.ResendEmail = (phone) =>{
    return new Promise((resolve,reject)=>{
        resolve();
    })
}

exports.CheckForEmail = (params) =>{
    const UserData = require('./Database').firebase.database();
    return new Promise((resolve,reject)=>{
        UserData.ref().child('users').orderByChild('uid').equalTo(params.uid).limitToFirst(1).once('child_added',(userch,err)=>{
                console.log(userch.val());
                if(userch.val() !== null)
                {
                    var addEmail = (userch.child('email').val() === null )
                    console.log(addEmail);   
                }
                resolve();
            });
    }).catch((err) => {
            console.log("HERE IN ERROR");
            console.log(err);
    });
}