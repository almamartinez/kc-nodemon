'use strict';
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let UserModel = mongoose.model('User');
var jwt = require('jsonwebtoken');
let sha256 = require('sha256');
let errorSender = require('../../../lib/errorDispatcher');
var config = require('../../../config/local_config');

/**
 * @api {post} /usuarios/:lang Registra un usuario
 * @apiName PostUser
 * @apiVersion 1.0.0
 * @apiGroup User
 *
 * @apiParam {string} lang Idioma en el que queremos que devuelva los errores
 * @apiParam {string} nombre Nombre del usuario que se mostrará en la aplicación.
 * @apiParam {string} email Identifica al usuario. No puede cambiarse.
 * @apiParam {string} clave Contraseña de usuario.
 *
 *
 * @apiSuccess {Object} usuario Usuario que se ha guardado en el sistema.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success":true,
 *          "saved":{
 *              "nombre": "test 3",
 *              "email": "test3@test.com",
 *              "clave": "password codificada"
 *              "_id": "id único en base de datos, del usuario.".
 *          }
 *     }
 *
 * @apiError UserFound Ese usuario ya existe en el sistema.
 *
 *
 */
router.post('/:lang/', function (req, res) {
    let usuario = new UserModel(req.body);
    //console.log(usuario);
    //Validamos el esquema
    let errors = usuario.validateSync();
    if (errors){
        //console.log('errors',errors);
        return errorSender({code:'Error en la validación de los campos', error:errors},req.params.lang, res.status(400));

    }
    //Comprobamos que no exista ya ese usuario (email)
    UserModel.findOne({email: usuario.email}).exec(function (err, user){
        if(err){
            return errorSender({code:'Error en el servidor', error:err},req.params.lang, res.status(500));
        }
        if (user){
            return errorSender({code:'Ese usuario ya existe en el sistema'},req.params.lang,res.status(400));
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

/**
 * @api {post} /usuarios/:lang/login Registra un usuario
 * @apiName PostUser
 * @apiVersion 1.0.0
 * @apiGroup User
 *
 * @apiParam {string} lang Idioma en el que queremos que devuelva los errores
 * @apiParam {string} email Identifica al usuario. No puede cambiarse.
 * @apiParam {string} clave Contraseña de usuario.
 *
 *
 * @apiSuccess {Object} token Token devuelto para que el cliente haga peticiones.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success":true,
 *          "saved":{
 *              "token": "token para peticiones"
 *          }
 *     }
 *
 * @apiError UserNotFound El usuario no existe en el sistema
 *
 *
 */
router.post('/:lang/login', function (req, res) {
    let email = req.body.email;
    let clave = sha256.x2(req.body.clave);

    UserModel.findOne({email:email}).exec(function (err, user) {
        if (err){
            return errorSender({code:'Error en el servidor', error:err},req.params.lang, res.status(500));
        }
        if (!user){
            return errorSender({code:'El usuario no existe en el sistema'},req.params.lang,res.status(400));
        }

        if (user.clave !== clave){
            return errorSender({code:'Error de autenticación'},req.params.lang,res.status(401));
        }

        //Usuario valido
        let token = jwt.sign({id: user._id},config.jwt.secret, {
            expiresIn: 60*10
        });

        res.json({success:true, token:token});
    });

});

module.exports = router;