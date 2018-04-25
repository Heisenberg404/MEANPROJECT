'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas;
var userRoutes = require('./routes/user');
var artistRoutes = require('./routes/artist');
var albumRoutes = require('./routes/album');
var songRoutes = require('./routes/song');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Auhorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
//rutas base
app.use('/api', userRoutes);
app.use('/api', artistRoutes);
app.use('/api', albumRoutes);
app.use('/api', songRoutes);


module.exports = app;