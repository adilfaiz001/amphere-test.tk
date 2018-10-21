exports.ResendEmail = (phone) =>{
    return new Promise((resolve,reject)=>{
        resolve();
    })
}

exports.CheckForEmail = (uid) =>{
    const UserData = require('./Database').firebase.database();
    return new Promise((resolve,reject)=>{
        UserData.ref().child('users').orderByChild('uid').equalTo(uid).limitToFirst(1).once('child_added',(userch,err)=>{
                console.log(userch.val());
                if(userch.val() !== null)
                {
                    var addEmail = (UserData.ref('users/user-' + userch.child('uid').val() + 'email').val() !== null )
                    console.log(addEmail);   
                }
                resolve();
            });
    }).catch((err) => {
            console.log("HERE IN ERROR");
            console.log(err);
    });
}