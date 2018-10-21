import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import './css/Header.css';
import $ from 'jquery';

import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import UserWorker from '../util/UserWorker';

class Header extends Component {

    constructor(){
        super();
        this.state = {
            sentMail:false,
            addEmail:false,
            uid:null,
            email:null
        };
    }

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
    }

    checkToken = () => {
        let token = localStorage.getItem('AMP_TK');
        console.log(token);
        if(token !== null){
            token = token.split('/');
            UserWorker.CheckForEmail({
                "uid":token[0]
            }).then((res) => {
                if(res.addEmail){
                    console.log('Setting addemail'+res.addEmail)
                    this.setState({
                        addEmail:true,
                        uid:token[0]
                    });
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
        UserWorker.AddEmail({
            "email":this.state.email,
            "uid" : this.state.uid
        }).then((res) => {
            if(res.success)
            {
                this.setState({
                    addEmail : false
                });
            }
        });
    }
    
    render() {
        return (
            <header>
                {/*
                    this.props.emailVerified ? 
                        <div className="email-msg">
                            {
                                !this.state.sentmail ?
                                <p>You have not verified your email address,<a onClick={this.resendEmail(this.props.phone)}>resend verification email</a></p>
                                :
                                <p>mail sent for verification,<a onClick={this.resendEmail(this.props.phone)}>resend verification email</a></p>
                            }
                            
                        </div> : console.log()
                 */           
                }

                
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
                    this.state.addEmail ?
                        <div className="email-container">
                            <div className="email-box">
                                <p>Add email to your account</p>
                                <input type="text" className="email-input" placeholder="Add your email" onChange={this.ValidateEmail}/>
                                <AwesomeButton size="medium" type="primary" color="teal" onClick={this.AddEmail}>Add Email</AwesomeButton>
                            </div>
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
                <label htmlFor="sidebar-toggle" className="hamburger"></label>
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