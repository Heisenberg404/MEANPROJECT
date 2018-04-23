'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/autheticated');
//subida de archivo
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song', md_auth.ensureAuth, SongController.getSong);


module.exports = api;