import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import './css/Header.css';
import $ from 'jquery';

import { AwesomeButton,AwesomeButtonProgress} from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import UserWorker from '../util/UserWorker';

class Header extends Component {

    constructor(){
        super();
        this.state = {
            sentMail:false,
            addEmail:false,
            addedEmail:false,
            emailVerify:false,
            emailVerified:false,
            uid:null,
            email:null,
            sidebarOpened:false
        };
    }
    
    //set emailVerified as true in constructor then check the emailVerifid in each response to set it to false.It will prevent
    //login bug of marking notification mark and then removing it afterwards.


    componentDidMount(){
        $(window).on("scroll", function() {
            if($(window).scrollTop() > 50) {
                $("header").addClass("active");
            } else {
               $("header").removeClass("active");
            }
        });
    }

    componentWillMount(){
        this.checkToken();
        this.setState({
            emailVerified:this.props.emailVerified
        });
    }

    checkToken = () => {
        let token = localStorage.getItem('AMP_TK');
        if(token !== null){
            token = token.split('/');
            UserWorker.CheckForEmail({
                "uid":token[0]
            }).then((res) => {
                if(res.addEmail){
                    this.setState({
                        addEmail:true,
                        uid:token[0]
                    });
                } else{
                    if(res.emailVerified){
                        this.setState({
                            emailVerified:true,
                            email:this.props.email,
                            uid:token[0]
                        });
                    } else {
                        this.setState({
                            emailVerify:true,
                            email:this.props.email,
                            uid:token[0]
                        });
                    }
                    
                }
            }).then(()=>{
                if(this.state.emailVerified)
                {
                    $('.email-container').removeClass('non-verified');
                    $('.email-container').css("height","55px");
                }
            });
        }
        
    }
    /*
    resendEmail = (phone) => {
        UserWorker.ResendEmail({
            "phone":phone
        }).then((res)=>{
            this.setState({
                sentMail:true
            });
        });
    }
    */

    ValidateEmail = (email) => {
        email.persist();
        if(email.target.valuue === "")
        {
            $(email.target).removeClass('error');
            this.setState({
                email:null
            });
        }
        else if (email.target.value !== "" && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.target.value)){
            $(email.target).removeClass('error');
            this.setState({
                email:email.target.value
            });
        } else{
            $(email.target).addClass('error');
        }
    }
    AddEmail = () => {
        console.log("Adding Email");
        if (this.state.email !== null)
        {
            UserWorker.AddEmail({
                "email":this.state.email,
                "uid" : this.state.uid
            }).then((res) => {
                if(res.success)
                {
                    this.setState({
                        addEmail : false,
                        addedEmail:true,
                        emailVerify:false
                    });
                }
                this.SendEmail();
            }).then(() => {
                console.log("Inside Listener");
                UserWorker.ListenVerification(this.state.uid).then((res) =>{
                    console.log("Res on update"+res);
                    if(res.state)
                    {
                        this.setState({
                            emailVerified:true
                        });
                    }
                });
            });
        } 
    }
    SendEmail = () => {
        UserWorker.SendEmail({
            "uid":this.state.uid,
            "email":this.state.email
        }).then((res) => {
            console.log(res);
            if(res.state){
                this.setState({
                    emailVerify:false
                });
            }
        })
    }
    sidebarOpener = (_state) => { 
        if(_state)
        {
            this.sidebarAborter();
        }
        else
        {
            this.setState({sidebarOpened:true});
        }
        
    }
    sidebarAborter = () => {
        this.setState({sidebarOpened:false});
    }
    
    render() {
        return (
            <header>
                <Image className="logo-text" src="assets/amphere-text.svg" />

                <input id="sidebar-toggle" type="checkbox" className="checkbox" />
                
                <div className="sidebar-shadow"></div>
                <div className="sidebar">
                    <div className="sidebar-banner">

                        <div className="sidebar-banner-container">
                            <p>MY ACCOUNT</p>
                            <h2>Hey {this.props.name}!</h2>
                            <p><b>Phone:</b> {this.props.phone}</p>
                        </div>
                        
                    </div>
                    {
                        this.props.login ?
                            <div className="email-container non-verified">
                            {
                            this.state.addEmail ?
                                    <div className="email-box">
                                        <p>Add email to your account</p>
                                        <input type="text" className="email-input" placeholder="Add your email" onBlur={this.ValidateEmail}/>
                                        <span onClick={this.AddEmail}>
                                            <AwesomeButton size="medium" type="primary" color="teal" >Add Email</AwesomeButton>
                                        </span>
                                    </div>
                                : 
                                <div>
                                    {
                                        this.state.addedEmail ?
                                            <div className="verify-email">
                                                <p>Thank you for adding your email to your account.</p>
                                                <p>Email has been sent for verification</p>
                                            </div> 
                                            :
                                            <div>
                                                {
                                                    this.state.emailVerify ? 
                                                        <div className="email-send-verify">
                                                            <p>Send Email for verification</p>
                                                            <AwesomeButtonProgress type="primary" size="large" loadingLabel="Sending.." action={(element,next) => this.SendEmail(next)}>Send Email</AwesomeButtonProgress>
                                                        </div>
                                                        :
                                                        <div>
                                                            {
                                                                this.state.emailVerified ? 
                                                                    <div className="email-final">
                                                                        <p>Email Verification</p>
                                                                        <svg class="checkemail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                                                                    </div>
                                                                    :
                                                                    <div className="email-sent">
                                                                        <p>Email Sent for verification</p>
                                                                    </div>                        
                                                            }
                                                        </div>            
                                                }
                                            </div>
                                    }
                                </div>
                            }   
                        </div>
                        :
                        console.log()
                    }
                    
                    <nav className="sidebar-nav">
                        <ul>
                            <li><a href="http://amphere.in">HOME</a></li>
                            <li><a href="http://amphere.in/contact">CONTACT</a></li>
                            <li><a href="http://amphere.in/about">ABOUT</a></li>
                        </ul>
                    </nav>
                </div>
                <label htmlFor="sidebar-toggle" className="hamburger" onClick={() => this.sidebarOpener(this.state.sidebarOpened)}>
                    {
                        this.props.login ?
                            !this.state.emailVerified ?
                                !this.state.sidebarOpened ?
                                    <label className="notify"></label>
                                    :
                                    console.log()
                                :
                                console.log()
                            :
                            console.log()
                    }
                </label>
                {
                    this.props.button ? 
                        <button className="button btn-small btn-noborder" 
                                id="exit-button"
                                onClick={this.props.logoutWorker}>Logout</button> :
                        console.log()
                }
            </header>
        );
    }
}

export default Header;