exports.ResendEmail = (phone) =>{
    return new Promise((resolve,reject)=>{
        resolve();
    })
}

exports.CheckForEmail = (phone) =>{
    const UserData = require('./Database').firebase.database();
    UserData.ref().child('users').orderByChild('phone').equalTo(phone).limitToFirst(1).once('child_added',(userch,err)=>{
        return new Promise((resolve,reject)=>{
            if(userch.val() !== null)
            {
                var addEmail = (UserData.ref('users/user-' + userch.child('uid').val() + 'email').val() !== null )
                console.log(addEmail);   
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
        
    })
}