'use strict';
var fs = require('fs');
var onError= function (err,msg){
        if (err){
            console.log('Error: ',err);
            return;
        }
    console.log('Message: ' + msg);
};

var leerJson= function (fichero, callback) {

    console.log(fichero);

    //leer el fichero.json
    fs.readFile(fichero, (err, data) => {
        if(err){
            return callback(err);            
        }
        let lista='';
        try{
            lista = JSON.parse(data);
        }catch (e) {
            console.log(e);
            return callback('No se pudo entender el formato del fichero ' + fichero);

        }
        //llamar la funcion de callback con lo parseado del json.
        return callback(null,lista);
        
    });
};

module.exports.onError=onError;
module.exports.loadData=leerJson;