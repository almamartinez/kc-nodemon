"use strict";

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let PushTokenModel = mongoose.model('PushNotificationToken');
let UserModel = mongoose.model('User');
let errorSender  = require('../../../lib/errorDispatcher');

router.post('/', function (req, res) {
    let pushToken = new PushTokenModel(req.body);
    console.log(pushToken);
    //Validamos el esquema
    let errors = pushToken.validateSync();
    if (errors){
        console.log('errors',errors);
        res.status(401);
        return errorSender(new Error('Error en la validación de los campos'), res);

    }
    if(typeof pushToken.usuario !== 'undefined'){
        //Comprobamos que si nos envían un usuario, éste exista. Si no, error.
        UserModel.findOne({_id: pushToken.usuario}).exec(function (err, user){
            if(err){
                return errorSender(err, res.status(500));
            }
            if (!user){
                return errorSender(new Error('El usuario no existe en el sistema'),res.status(401));
            }
            pushToken.save(function(err, saved){
                if (err){
                    return errorSender(err, res.status(500));
                }
                return res.json({success:true, saved: saved});
            });
        });
    }else{
        pushToken.save(function(err, saved){
            if (err){
                return errorSender(err, res.status(500));
            }
            return res.json({success:true, saved: saved});
        });
    }
    
});

module.exports = router;