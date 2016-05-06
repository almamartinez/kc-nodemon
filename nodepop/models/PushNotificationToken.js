'use strict';
var mongoose = require('mongoose');

//Creamos el esquema
var pushNotificationTokenSchema = mongoose.Schema({
    plataforma: {required:true, type: String, enum: ['ios', 'android']},
    token: String,
    usuario: String

});

//Lo asignamos al modelo. OJO! mongoose lo pone en minusculas y en plural cuando crea la Collection
mongoose.model('PushNotificationToken', pushNotificationTokenSchema);

