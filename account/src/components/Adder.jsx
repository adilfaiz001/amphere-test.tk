import React, { Component } from 'react';
import './css/Adder.css';

class Adder extends Component {
    render() {
        return (
            <div>
                <div className="email-add">
                    <p><a href="/addEmail">Add email to your account</a></p>
                </div>
                <div className="email-input">
                    <input type="text" className="email-input" placeholder="Add your email"/>
                    <input type="submit" className="email-submit" name="submit-email" id="submit-btn" placeholder="add"/>
                </div>
            </div>
        )
    }
}

export default Adder;