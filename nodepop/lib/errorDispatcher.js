"use strict";
let Localize = require('localize');

let myLocalize = new Localize('../config/');
function errorSend(err, res) {
    err.message=err.message;

    return res.json({
        success:false,
        error:err
    });
}

module.exports = errorSend;