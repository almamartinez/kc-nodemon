"use strict";

var express = require('express');
var router = express.Router();
let mongoose = require('mongoose')
let UserModel = mongoose.model('User');
let sha256 = require('sha256');
let errorSender = require('../../../lib/errorDispatcher');


router.post('/', function (req, res) {
    let usuario = new UserModel(req.body);
    console.log(usuario);
    //Validamos el esquema
    let errors = usuario.validateSync();
    if (errors){
        console.log('errors',errors);
        res.status(401);
        return errorSender({code:'VALIDATION_ERROR', err:errors}, res);

    }
    //Comprobamos que no exista ya ese usuario (email)
    UserModel.findOne({email: usuario.email}).exec(function (err, user){
        if(err){
            return res.status(401).json({
                success:false,
                error: err
            });
        }
        if (user){
            return res.status(401).json({
                success:false,
                error: 'USER_EXISTS'
            });
        }
        usuario.clave = sha256.x2(usuario.clave);
        usuario.save(function(err, saved){
            if (err){
                return res.status(401).json({
                    success:false,
                    error: err
                });
            }
            return res.json({success:true, saved: saved});
        });
    });
});

router.post('/login', function (req, res) {
    let email = req.body.email;
    let clave = sha256.x2(req.body.clave);

    UserModel.findOne({email:email}).exec(function (err, user) {
        if (err){
            return res.status(500).json({success: false, error:err});
        }
        if (!user){
            return res.status(401).json({success: false, error:'USER_NOT_EXIST'});
        }

        if (user.clave !== clave){
            return res.status(401).json({success: false, error:'AUTHENTICATE_FAILED'});
        }

        //Usuario valido
       /* var token = jwt.sign({id: user._id},config.jwt.secret, {
            expiresIn: '2 days' //en segundos o un string
        });*/

        res.json({success:true, token:'blablabla'});
    })

});

module.exports = router;