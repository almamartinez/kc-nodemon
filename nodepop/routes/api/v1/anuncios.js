'use strict';
let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let AnuncioModel = mongoose.model('Advertisement');
let errorSender = require('../../../lib/errorDispatcher');
var jwtAuth = require('../../../lib/jwtAuth');

router.use(jwtAuth());

/**
 * @api {get} /anuncios/:lang Listado de anuncios filtrados por los parámetros de entrada y paginados.
 * @apiName GetAnuncios
 * @apiVersion 1.0.0
 * @apiGroup Anuncios
 *
 * @apiParam {string} token Token de autenticación que se devolvió en el login
 * @apiParam {string} nombre Nombre por el que buscar. Sacará todos los que su nombre empiece por este valor.
 * @apiParam {Array} tags lista de Tags(strings) separados por comas.
 * @apiParam {boolean} venta Si true sólo saca las ventas, si false las búsquedas.
 * @apiParam {double} preciomin precio mínimo del artículo
 * @apiParam {double} preciomax precio máximo del artículo
 * @apiParam {int} start a partir de qué resultado enviar
 * @apiParam {int} limit número de resultados a enviar
 * @apiParam {int} sort campo por el que ordenar. - delante ordena decreciente.
 *
 * @apiSuccess {Object} Objeto con un array de anuncios disponibles.
 *

 * @apiError NotAuthenticated El usuario no está autenticado
 *
 *
 */
router.get('/:lang?/',function (req, res){
    let criteria ={};
    if (typeof req.query.nombre !== 'undefined'){
        criteria.nombre =  { $regex: /^req.query.nombre/i } ;
    }
    if (typeof req.query.tags !== 'undefined'){
        criteria.tags = {$in: req.query.tags.split(',') } ;
    }
    if (typeof req.query.venta !== 'undefined'){
        criteria.venta =  req.query.venta;
    }
    let precioMin = parseFloat(req.query.preciomin) || 0;
    let precioMax = parseFloat(req.query.preciomax) || null;
    if (precioMax){
        criteria.precio =  { $gte:precioMin, $lte:precioMax };
    }else {
        criteria.precio = { $gte:precioMin } ;
    }

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || null;
    let sort = req.query.sort || null;

    AnuncioModel.list(criteria,start,limit, sort, function (err, rows) {
        if (err){
            return  errorSender({code:'Error en el servidor', error:err},req.params.lang,res.status(500));
        }
        res.json({success:true, rows});
    });
});

/**
 * @api {get} /anuncios/:lang/tags Listado de los tags disponibles
 * @apiName GetTags
 * @apiVersion 1.0.0
 * @apiGroup Anuncios
 *
 * @apiParam {string} token Token de autenticación que se devolvió en el login
 *
 * @apiSuccess {Object} Objeto con un array de strings con los tags disponibles.
 *

 * @apiError NotAuthenticated El usuario no está autenticado
 *
 *
 */
router.get('/:lang?/tags',function (req, res){
    AnuncioModel.listTags(function(err,rows){
        if (err){
            return  errorSender({code:'Error en el servidor', error:err},req.params.lang,res.status(500));
        }
        res.json({success:true, rows:rows});

    });
});

module.exports = router;