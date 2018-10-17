import React, { Component } from 'react';
import './Forgot.css';
import './GlobalStyles.css';
import $ from 'jquery';
import EmailValidation from './EmailValidation';

class Forgot extends Component{
    constructor(){
        super();
        this.state = {
            email:null,
            emailValid:false,
            emailSent:false
        };
    }

    validateEmail = (_email) => {
        _email.persist();
        if(_email.target.value==="")
        {
            $(_email.target).removeClass('error');
            this.setState({
                email:null,
                emailValid:false
            });
        }
        else if(_email.target.value!=="" && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(_email.target.value)){
            EmailValidation.ValidateEmail(_email.target.value).then((result)=>{
                if(result.valid){
                    $(_email.target).removeClass("error");
                    $(_email.target).addClass("success");
                    this.setState({
                        email:result.email,
                        emailValid:true
                    });
                }
            })
        }
        else
        {
            $(_email.target).removeClass("success");
            $(_email.target).addClass("error");
            this.setState({
                email:null,
                emailvalid:false
            });
        }
    }

    resetPassword = () =>{
        EmailValidation.SendMail({
            "email":this.state.email
        }).then((_res)=>{
            if(_res.state){
                this.setState({
                    emailSent:true
                });
            }
            else{
                this.setState({
                    email:false
                });
                alert("ERROR:We are sorry for this inconvenience.We will set this away.")
            }
        });
    }
    render(){
        return(
            <div>
                {
                /*
                <header>
                    <Image className="logo-text" src="assets/amphere-text.svg"/>
                </header>
                */
                }
                <div className="cover">
                    <div className="reset-container">
                    {
                        !this.state.emailValid ? 
                            <p>No user account with this email</p> : console.log()
                    }
                    <div>
                        <p className="reset">Enter your Email to reset password</p>
                        <input type="text" id="email" name="email" value="" placeholder="Email" autoFocus spellCheck="false" onChange={()=>this.validateEmail}/>
                        <input type="submit" id="reset-button" name="reset" value="Reset Password" onClick={() => this.resetPassword}/>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Forgot;