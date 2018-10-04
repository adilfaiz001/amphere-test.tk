const firebaseLogin = require('./Database');
const async = require('../node_modules/async');
const crypto = require('crypto');
const nodemailer = require('../node_modules/nodemailer');
const Hasher = require('./PasswordHasher');

const userData = firebaseLogin.firebase.database();


exports.ResetPassword = function(req,res,next){

  
  async.waterfall([
    function(done) {
      crypto.randomBytes(20,function(err,buf){
        var token = buf.toString('hex');
        done(err,token);
      });
    },
    function(token,done){
      console.log('Password Reset Initialize');
      userData.ref().child('users').orderByChild('email').equalTo(req.body.email).once('value',(userch,err)=>{
        if(userch.val() === null)
        {
          console.log('No user account');
          req.flash('error','No account with '+req.body.email);
          return res.redirect('/forget');
        }

        else
        {
          let uid = userch.child('uid').val();  
          let email = userch.child('email').val();
          userData.ref('users/user-'+uid).update({
            "resetPasswordToken" : token,
            "resetPasswordExpires" : Date.now() + 3600000
          });
          done(err,token,email);
        }
      });
    },
    function(token,email,done){
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'amphere.solutions@gmail.com',
          pass: 'ArpitGujjar@123'
        }
      });
      var mailOptions = {
        to: email,
        from: 'amphere.solutions@gmail.com',
        subject: 'amphere-solutions password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions,function(err){
        console.log('mail sent');
        req.flash('success','An email has been sent to '+email+' with further instructions.');
        done(err,'done');
      });
    }
  ],function(err){
        res.redirect('/forget');
  });
}


exports.UpdatePassword = function(req,res)
{
  async.waterfall([
    function(done){
      var timestamp = Date.now();
      userData.ref().child('users').orderByChild('resetPasswordToken').equalTo(req.params.token).once('value',(userch,err)=>{

        if (userch.val()===null)
        {
          console.log("Token Expires");
          req.flash('error', 'Password reset token is invalid.');
          return res.redirect('back');
        }
        else if(userch.child('resetPasswordExpires').val()<timestamp){
          console.log('Token Expires');
          req.flash('error','Password reset token expires');
          return res.redirect('/forget');
        }
        else if(req.body.password === req.body.confirm){

          let uid = userch.child('uid').val();
          let email = userch.child('email').val();
          let salt = userch.child('salt').val();
          let hash = Hasher.generateHash(req.body.password,salt);

          userData.ref('users/user-'+uid).update({
            'password': hash,
            'resetPasswordToken':null,
            'resetPasswordExpires':null
          });
          done(err,email);
        }
        else{
          req.flash("error","Password do not match");
          return res.redirect('back');
        }
      });
    },
    function(email,done){
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
          user: 'amphere.solutions@gmail.com',
          pass: 'ArpitGujjar@123'
        }
      });
      var mailOptions = {
        to: email,
        from: 'amphere.solution@gmail.com',
        subject: "Your Password has been changed",
        text:'Hello,\n\n' +
            'This is a confirmation that the password for your account '+email+' has been just changed.\n'

      };
      smtpTransport.sendMail(mailOptions,function(err){
        console.log("Confirmation mail sent");
        req.flash('success','Success! Your password has been changed.');
        done(err);
      });
    }
  ],function(err){
    res.redirect('/forget');
  });
}