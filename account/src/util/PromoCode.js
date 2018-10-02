const firebaseLogin = require('./Database');

export default function RemovePromoCode(code,user)
{
    const cpn_db = firebaseLogin.firebase.database();

    if(code!==null){

        cpn_db.ref().child('coupans').orderByChild('code').equalTo(code).limitToFirst(1).once('child_added',(coupan)=>{
            cpn_db.ref('coupans/cid-'+code).update({
                "code" : null,
                "amount" : null,
                "expireDate" : null,
                "isActive" : false,
                "isDeleted":true,
                "user":user
            });
        });
    }
}