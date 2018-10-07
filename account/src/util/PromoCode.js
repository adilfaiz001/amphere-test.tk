const firebaseLogin = require('./Database');

export default function RemovePromoCode(code,user)
{
    const CouponData = firebaseLogin.firebase.database();

    if(code!==null){
        CouponData.ref().child('coupons').orderByChild('code').equalTo(code).limitToFirst(1).once('child_added',(coupon)=>{
            CouponData.ref('coupons/cid-' + coupon.child('cid').val()).update({
                "coupon" : coupon.child('code').val(),
                "code" : null,
                "expireDate" : null,
                "isActive" : false,
                "isDeleted":true,
                "user":user
            });
        });
    }
}