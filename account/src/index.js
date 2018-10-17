import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Super from './Super';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route } from 'react-router-dom';
import Forgot from './Forgot';

ReactDOM.render(
    <Router>
        <Super />
        <Route path="/forgot" component={Forgot} />
    </Router>, 
    document.getElementById('root'));
registerServiceWorker();