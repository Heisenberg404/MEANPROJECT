'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    res.status(200).send({message: "test song"});
}

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err) {
            res.status(500).send({message: "server error save song"});
        }else {
            if(!songStored) {
                res.status(404).send({message: "song not saved"});
            }else {
                res.status(200).send({songStored});
            }
        }
    });
}

module.exports = {
    getSong
};