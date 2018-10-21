import React, { Component } from 'react';
import './css/Adder.css';
import $ from 'jquery';

class Adder extends Component {
    componentDidMount(){

    }
    render() {
        return (
            <div className="container">
                <div className="email-box">
                    <p>Add email to your account</p>
                    <input type="text" className="email-input" placeholder="Add your email"/>
                    <input type="submit" className="email-submit" name="submit-email" id="submit-btn" placeholder="add"/>
                </div>
            </div>
        )
    }
}

export default Adder;