'use strict';
/**
 * Your utility library for express
 */
var jwt = require('jsonwebtoken');
var configJWT = require('../config/local_config').jwt;

let errorSender = require('./errorDispatcher');

/**
 * JWT auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', jwtAuth());
 *
 * @returns {function} Express 4 middleware
 */
module.exports = function() {
    return function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, configJWT.secret, function(err, decoded) {
                if (err) {
                    return errorSender( {message: 'Error de autenticación'},req.params.lang,res.status(401)); 
                    //res.json({ ok: false, error: {code: 401, message: 'Failed to authenticate token.'}});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    console.log('decoded: ', decoded);
                    next();
                }
            });
        } else {
            // if there is no token return error
            return errorSender( {message: 'Autenticación necesaria'},req.params.lang,res.status(403));
            //res.status(403).json({ok: false,error: { code: 403, message: 'No token provided.'}});
        }
    };
};

