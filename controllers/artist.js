'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({message: 'error in request'});
        }else {
            if (!artist) {
                res.status(404).send({message: 'id artist does not exits'});
            }else {
                res.status(200).send({artist});
            }
        }
    });
}

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    }else {
        var page = 1;
    }
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
        if(err){
            res.status(500).send({message: 'error in request'});
        }else{
            if (!artists) {
                res.status(404).send({message: 'empty list'});
            }else {
                res.status(200).send({
                    totalItems: total,
                    artists: artists 
                });
            }
        }
    });
    
}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: "Error saving artist"});
        }else {
            if(!artistStored) {
                res.status(404).send({message: 'new artist didn`t save'});
            }else {
                res.status(200).send({artist: artistStored});                
            }
        }
    });
}


function updateArtist(req, res) {
    var artistId = req.params.id;
    var updateObj = req.body;

    Artist.findByIdAndUpdate(artistId, updateObj, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: "Error updating artist"});
        }else{
            if(!artistUpdated) {
                res.status(404).send({message: 'artist didn`t update'});
            }else {
                res.status(200).send({artist: artistUpdated});                
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: "Error deleting artist"});
        }else{
            if(!artistRemoved) {
                res.status(404).send({message: 'artist didn`t remove'});
            }else {
                res.status(404).send({artistRemoved}); 
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if(err){
                        res.status(500).send({message: "Error deleting album"});
                    }else{
                        if(!albumRemoved) {
                            res.status(404).send({message: 'album didn`t update'});
                        }else {
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if(err){
                                    res.status(500).send({message: "Error deleting song"});
                                }else{
                                    if(!songRemoved) {
                                        res.status(404).send({message: 'song didn`t update'});
                                    }else {
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });   
                        }
                    }
                });           
            }
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist
}

