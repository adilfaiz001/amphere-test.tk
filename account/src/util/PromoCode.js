const firebaseLogin = require('./Database');

export default function RemovePromoCode(code,user)
{
    const CouponData = firebaseLogin.firebase.database();

    if(code!==null){
        CouponData.ref().child('coupons').orderByChild('code').equalTo(code).limitToFirst(1).once('value',(coupon)=>{
            console.log(coupon.val());
            CouponData.ref('coupons/cid-'+coupon.val().cid).update({
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