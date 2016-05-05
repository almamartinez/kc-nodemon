"use strict";
let Localize = require('localize');
//cargar librerías
var fs=require('fs');
var path =require('path');
let config = require('../config/translations');

//let localize = new Localize('./config/');
console.log(config);

function errorSend(err, lang, res) {
//    console.log(err,lang,localize, localize.translate(err.message));
   // localize.setLocale('en');
//    err.message = localize.translate(err.message);

    return res.json({
        success:false,
        error:err
    });
}

module.exports = errorSend;