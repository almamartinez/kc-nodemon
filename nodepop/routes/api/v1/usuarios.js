'use strict';
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let UserModel = mongoose.model('User');
var jwt = require('jsonwebtoken');
let sha256 = require('sha256');
let errorSender = require('../../../lib/errorDispatcher');
var config = require('../../../config/local_config');


router.post('/:lang/', function (req, res) {
    let usuario = new UserModel(req.body);
    //console.log(usuario);
    //Validamos el esquema
    let errors = usuario.validateSync();
    if (errors){
        //console.log('errors',errors);
        return errorSender({code:'Error en la validación de los campos', error:errors},req.params.lang, res.status(401));

    }
    //Comprobamos que no exista ya ese usuario (email)
    UserModel.findOne({email: usuario.email}).exec(function (err, user){
        if(err){
            return errorSender({code:'Error en el servidor', error:err},req.params.lang, res.status(500));
        }
        if (user){
            return errorSender({code:'Ese usuario ya existe en el sistema'},req.params.lang,res.status(401));
        }
        usuario.clave = sha256.x2(usuario.clave);
        usuario.save(function(err, saved){
            if (err){
                return errorSender(err,req.params.lang, res.status(500));
            }
            return res.json({success:true, saved: saved});
        });
    });
});

router.post('/:lang/login', function (req, res) {
    let email = req.body.email;
    let clave = sha256.x2(req.body.clave);

    UserModel.findOne({email:email}).exec(function (err, user) {
        if (err){
            return errorSender({code:'Error en el servidor', error:err},req.params.lang, res.status(500));
        }
        if (!user){
            return errorSender({code:'El usuario no existe en el sistema'},req.params.lang,res.status(401));
        }

        if (user.clave !== clave){
            return errorSender({code:'Error de autenticación'},req.params.lang,res.status(403));
        }

        //Usuario valido
        let token = jwt.sign({id: user._id},config.jwt.secret, {
            expiresIn: 60*10
        });

        res.json({success:true, token:token});
    });

});

module.exports = router;