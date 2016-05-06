'use strict';

let config = require('../config/translations');

function errorSend(err, lang, res) {

    if (err.code) {
        //Primero me aseguro de que siempre devuelva un mensaje
        err.message=err.code;
        let elem = config[err.code];
        if (elem) {
            err.message = elem[lang];
        }
    }
    return res.json({
        success:false,
        error:err
    });
}

module.exports = errorSend;