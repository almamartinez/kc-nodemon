'use strict';
require('./connectMongoose');
require('../models/Advertisement');
require('../models/User');
let async = require('async');
let utils = require('./Utils');
let mongoose = require('mongoose');
let sha256 = require('sha256');


let Advert = mongoose.model('Advertisement');
let User = mongoose.model('User');

async.series([ function(callback){
    Advert.deleteAll(function(error){
        if (error){
            return callback(error);
        }
        utils.loadData('./public/jsons/anuncios.json', (err, data)=>{
            if (err){
                console.log('Error: ', err);
                return callback(err);
            }
            async.map(data.anuncios,function(anuncioJson,callback2){
                //console.log('grabando anuncio',anuncioJson);
                let anuncio = new Advert(anuncioJson);
                anuncio.save(function(err, saved){
                    if (err){
                        console.log('Error: ', err);
                        return callback2(err);
                    }
                    return callback2(null,saved);
                });
            },callback);
        });
    });},
    function(callback){
        User.deleteAll(function(error){
            if (error){
                return callback(error);
            }
            utils.loadData('./public/jsons/usuarios.json', (err, data)=>{
                if (err){
                    return callback(err);
                }
                async.map(data.usuarios,function(usuarioJson,callback2){
                    //console.log('grabando usuario',usuarioJson);
                    let usuario = new User(usuarioJson);

                    usuario.clave = sha256.x2(usuario.clave);
                    usuario.save(function(err, saved){
                        if (err){
                            return callback2(err);
                        }

                        return callback2(null,saved);
                    });
                },
                callback);
            });
        });
    }
    ],
    function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
        console.log('desconecto de la bd');
        mongoose.disconnect();
    }
);




