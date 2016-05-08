'use strict';

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let PushTokenModel = mongoose.model('PushNotificationToken');
let UserModel = mongoose.model('User');
let errorSender  = require('../../../lib/errorDispatcher');

/**
 * @api {post} /pushtoken/ Registra un token para envío de notificaciones Push
 * @apiName PostPushToken
 * @apiVersion 1.0.1
 * @apiGroup PushToken
 *
 * @apiParam {string="android","ios"} plataforma Plataforma del dispositivo que generó el token.
 * @apiParam {string} token Token al que enviar las notificaciones Push
 * @apiParam {string} [usuario] identificador del usuario registrado asociado al token.
 *
 *
 * @apiSuccess {Object} tokenPush objeto que ha guardado el sistema
 *
 *
 * @apiError UserNotFound Ese usuario no existe en el sistema.
 * @apiError ErrorValidation Error en la validación de los campos.
 *
 */
router.post('/', function (req, res) {
    let pushToken = new PushTokenModel(req.body);
    //Validamos el esquema
    let errors = pushToken.validateSync();
    if (errors){
        res.status(401);
        return errorSender({code:'ErrorValidation',error:errors},req.lang, res);

    }
    if(typeof pushToken.usuario !== 'undefined'){
        //Comprobamos que si nos envían un usuario, éste exista. Si no, error.
        UserModel.findOne({_id: pushToken.usuario}).exec(function (err, user){
            if(err){
                return errorSender({code:'Error en el servidor', error:err},req.lang, res.status(500));
            }
            if (!user){
                return errorSender({code:'El usuario no existe en el sistema'},req.lang,res.status(400));
            }
            pushToken.save(function(err, saved){
                if (err){
                    return errorSender({code:'Error en el servidor', error:err},req.lang, res.status(500));
                }
                return res.json({success:true, saved: saved});
            });
        });
    }else{
        pushToken.save(function(err, saved){
            if (err){
                return errorSender({code:'ServerError', error:err},req.lang, res.status(500));
            }
            return res.json({success:true, saved: saved});
        });
    }
    
});

module.exports = router;