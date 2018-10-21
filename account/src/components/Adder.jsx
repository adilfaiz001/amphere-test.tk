import React, { Component } from 'react';
import './css/Adder.css';
import $ from 'jquery';

class Adder extends Component {
    componentDidMount(){
        $('#add-email').on('click',function(){
            $('#add-email').addClass('slide-up');
            $('.email-input').removeClass('hid');
            $('.email-input').addClass('slide-down');
        });
    }
    render() {
        return (
            <div className="container">
                <div className="email-add">
                    <p><a id="add-email">Add email to your account</a></p>
                </div>
                <div className="email-input hid">
                    <input type="text" className="email-input" placeholder="Add your email"/>
                    <input type="submit" className="email-submit" name="submit-email" id="submit-btn" placeholder="add"/>
                </div>
            </div>
        )
    }
}

export default Adder;