import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Super from './Super';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Forgot from './Forgot';

ReactDOM.render(
    <Super />,
    <Router>
        <Route path="/forgot" component={Forgot} />
    </Router>, 
    document.getElementById('root'));
registerServiceWorker();