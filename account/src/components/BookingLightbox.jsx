import React, { Component } from 'react';
import './css/BookingLightbox.css';
import '../GlobalStyles.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import $ from 'jquery';

import LocationValidation from '../util/LocationValidation';
import PromoCodeValidate from '../util/PromoCodeValidation';
import RemovePromocode from '../util/PromoCode';

class BookingLightbox extends Component {
    constructor(){
        super();
        this.state = {
            duration: 42,  
            locCode: null,
            location: null,
            locCodeValid: null,
            device: "microUSB",
            //------//
            promoCode: null,
            promoValid: false,
            promoAmount:null,
            amount40:null,
            amount60:null
            //------//
        };
    }

    confirmSession = () => {
        this.props.paramsHandler(this.state);
        //-----//
        RemovePromocode(this.state.promoCode,this.props.user);
        //-----//
    }


    closeLightbox = () => {
        this.props.aborter();
    }

    setDuration = (_value) => {
        let set = 0;
        if(_value===1) set = 42;
        else if(_value===2) set = 62;

        this.setState({ duration: set });
    }

    setDevice = (_value) => {
        let set = "";
        if(_value===1){
            set = "iOS"
        } else if(_value===2){
            set = "microUSB"
        } else if(_value===3){
            set = "USB-C"
        }
        this.setState({
            device: set
        });
    }

    locCodeValidator = (_code) => {
        _code.persist();
        if(_code.target.value===""){
            $(_code.target).removeClass('error');
            this.setState({
                location: null,
                locCodeValid: null
            });
        } else {
            LocationValidation.validateLocationCode(_code.target.value)
            .then((result)=>{
                if(result.valid===true){
                    $(_code.target).removeClass('error');
                    this.setState({
                        locCode: result.code,
                        locCodeValid: true
                    });
                } else if(result.valid===false) {
                    $(_code.target).addClass('error');
                    this.setState({
                        location: null,
                        locCodeValid: false
                    });
                }
            });
        }
    }

    promoValidator = (_code) => {
        //-------//
        _code.persist();
        if(_code.target.value===""){
            $(_code.target).removeClass('error');
            this.setState({
                promoCode: null,
                promoAmount: null,
                promoValid:false
            });
        } else{
            PromoCodeValidate(_code.target.value,this.props.user).then((result)=>{
                if(result.valid){
                    $(_code.target).addClass("success");
                    return new Promise((resolve,reject)=>{
                        this.setState({
                            promoCode: result.promoCode,
                            promoAmount:result.amount,
                            promoValid: true
                        });
                        resolve({
                            "success":true
                        });
                    }).then(()=>{
                        this.couponAmount(20);
                    });
                    
                } else {
                    $(_code.target).removeClass("success");
                    $(_code.target).addClass("error");
                    this.setState({
                        promoCode: "Invalid Code",
                        promoValid: false,
                        promoAmount:null
                    });
                }
            });
        }    
        //------//  
    }

    couponAmount = (promoAmount) => {
        var amt = 10;
        var amt40 = 0;
        var amt60 = 0;
        var device = this.state.device;
        var duration = this.state.duration;

        console.log(promoAmount);
        return new Promise((resolve,reject)=>{
            console.log(this.state);
            if(device==="iOS") {
                if(duration < 50 ) amt40 = 0;
                else amt60 = 40 - promoAmount;
            } else if (device==="microUSB" || device==="USB-C") {
                if(duration < 50 ) amt40 = 0;
                else amt = 30 - promoAmount;
            }
            this.setState({
                amount40:amt40,
                amount60:amt60
            });
            resolve({
                "success":true
            });
        });   
    } 

    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">
                <button className="cross-button" onClick={this.closeLightbox.bind(this)}></button>
                    <div className="session-settings-holder">
                        <h2 className="lightbox-title">NEW SESSION</h2>

                        <div className="location">
                            <div className="location-code">
                                <input id="location-code" required className="textbox" placeholder="Enter Location Code" onChange={(event)=>{this.locCodeValidator(event)}}/>
                            </div>
                            {/* {
                                (this.state.locCodeValid) ? <div className="checkmark"></div> : (
                                    (this.state.locCodeValid===null) ?  console.log() : (
                                        (this.state.locCodeValid==="CHECKING") ? <div className="spinner"></div> : (
                                            (this.state.locCodeValid===false) ? <div className="crossmark"></div> : (
                                                console.log("INTERNAL ERROR")
                                            )
                                        )
                                    )
                                )
                            } */}
                        </div>

                        <div className="toggle-bars">
                            <ButtonToolbar className="duration-bar">
                                <ToggleButtonGroup onChange={this.setDuration} type="radio" name="options" defaultValue={1} className="toggle-group">
                                    <ToggleButton className="toggle-btn" value={1}>40 mins</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={2}>60 mins</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>

                            <ButtonToolbar className="device-bar">
                                <ToggleButtonGroup onChange={this.setDevice} type="radio" name="options" defaultValue={2} className="toggle-group">
                                    <ToggleButton className="toggle-btn" value={1}>iOS</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={2}>microUSB</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={3}>USB-C</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                        </div>

                        <div className="promo-holder">
                            <input id="promo-code"
                                required="true"
                                className="textbox-small"
                                spellCheck="false"
                                placeholder="Promo Code (Optional)"
                                onChange={(code) => this.promoValidator(code)}/>
                                {
                                    this.state.promoValid ? (
                                        <div>
                                            <p>Duration 40min : {this.state.amount40}</p>
                                            <p>Duration 60min : {this.state.amount60}</p>
                                        </div>
                                        
                                    ) : console.log()
                                }

                                
                                
                        </div>

                        <p className="info">After booking the session, you will receive
                        an SMS with your OTP in it. Supply it to the restaurant’s staff.
                        </p>

                        {
                            (this.state.locCodeValid) ? (
                                <button className="confirm-session-button"
                                        onClick={this.confirmSession}>CONFIRM SESSION</button>
                            ) : (
                                <button className="confirm-session-button button-disabled"
                                        onClick={this.confirmSession}
                                        disabled>CONFIRM SESSION</button>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default BookingLightbox;
