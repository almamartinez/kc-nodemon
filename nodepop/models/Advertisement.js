'use strict';
let mongoose = require('mongoose');

//Creamos el esquema
let advertSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true //hacemos que el nombre sea requerido
    },
    venta: {
        type: Boolean,
        default: true
    },
    precio: {
        type: Number,
        required: true,
        default: 0
    },
    foto: String,
    tags:  { type: [String], index: true }
});


advertSchema.statics.deleteAll= function (callback) {
        Advertisement.remove({}, function (err) {
        //console.log('borrando anuncios...');
        if (err) return callback(err);
        callback(null);
    });
};
advertSchema.statics.list = function (filter, start,limit, sort, cb){
    
    let query = Advertisement.find(filter);
    //como no le pusimos el exec, podemos poner mas cosas a la query
    query.skip(start);
    if(typeof limit === 'number'){
        query.limit(limit);
    }
    query.sort(sort);
    return query.exec(cb); 
};

advertSchema.statics.listTags = function (callback){
    let query = Advertisement.distinct('tags');
    return query.exec(callback);
};
//Lo asignamos al modelo. OJO! mongoose lo pone en minusculas y en plural cuando crea la Collection
var Advertisement = mongoose.model('Advertisement', advertSchema);

