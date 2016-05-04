"use strict";

function errorSend(err, res) {
    let errString = err.code;

    return res.json({
        success:false,
        error:errString
    });
}

module.exports = errorSend;