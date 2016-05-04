"use strict";
let mongoose = require('mongoose');

//Creamos el esquema
let userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true //hacemos que el nombre sea requerido
    },
    email: {
        type: String,
        index: true,
        required: true
    },
    clave: {
        type: String,
        required: true
    }
});

userSchema.statics.deleteAll= function (callback) {
    UserModel.remove({}, function (err) {
        console.log('borrando usuarios...')
        if (err) return callback(err);
        callback(null,'All Users deleted');
    });
};


//Lo asignamos al modelo. OJO! mongoose lo pone en minusculas y en plural cuando crea la Collection
var UserModel = mongoose.model('User', userSchema);
