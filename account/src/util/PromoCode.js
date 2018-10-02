const firebaseLogin = require('./Database');

export default function RemovePromoCode(code,user)
{
    const CouponData = firebaseLogin.firebase.database();

    if(code!==null){

        CouponData.ref().child('coupons').orderByChild('code').equalTo(code).limitToFirst(1).once('child_added',(coupon)=>{
            CouponData.ref('coupons/cid-'+code).update({
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