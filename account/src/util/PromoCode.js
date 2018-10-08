const firebaseLogin = require('./Database');

export default function RemovePromoCode(code,userphone)
{
    const CouponData = firebaseLogin.firebase.database();
    const UserData = firebaseLogin.firebase.database();

    if(code!==null){
        CouponData.ref().child('coupons').orderByChild('code').equalTo(code).limitToFirst(1).once('child_added',(coupon)=>{
            
            var user = coupon.child('user').val();
            console.log(user);
            if(user === 'unique')
            {
                var count = coupon.child('count').val();
                if(count>0)
                {   
                    CouponData.ref('coupons/cid-' + coupon.child('cid').val()).update({
                        "count":count-1
                    }).then(()=>{
                        count = count - 1;
                        console.log("then body",count)
                        if(count === 0)
                        {
                            CouponData.ref('coupons/cid-' + coupon.child('cid').val()).update({
                                "coupon" : coupon.child('code').val(),
                                "code" : null,
                                "expireDate" : null,
                                "isActive" : false,
                                "isDeleted":true,
                                "userphone":userphone,
                                "count":0
                            });
                        }
                    });  
                }
            }
            else if(user === 'general')
            {
                UserData.ref().child('users').orderByChild('phone').equalTo(userphone).limitToFirst(1).once('child_added',(userch)=>{
                    console.log(userch.val());
                    if(userch.val() !== null)
                    {
                        UserData.ref('users/user-' + userch.child('uid')).update({
                            "coupon-test":userch.child('coupon-test').val() - 1 
                        });
                    }
                });
            }     
        });
    }
}