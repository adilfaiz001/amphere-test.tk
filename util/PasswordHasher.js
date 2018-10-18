'use strict';
const crypto = require('crypto');

exports.generateHash = (password, salt) => {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};

exports.generateUserIdHash = (uid) =>{
    var UserIdHash = crypto.createHash('md5').update(uid).digest('hex');
    return UserIdHash;
};