'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas;
var userRoutes = require('./routes/user');
var artistRoute = require('./routes/artist');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//configurar cabeceras http

//rutas base
app.use('/api', userRoutes);
app.use('/api', artistRoute);


module.exports = app;