'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err){
            res.status(500).send({message: 'request error'});
        }else{
            if(!album){
                res.status(404).send({message: 'album not found'});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId){
        //get all albums of db
        var find = Album.find({}).sort('title');
    }else {
        //get albums by artist
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'error getting albums'});
        } else {
            if(!albums){
                res.status(404).send({message: 'no albums find'});
            }else{
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err) {
            res.status(500).send({message: 'server error'});
        }else {
            if (!albumStored){
                res.status(404).send({message: 'album didn`t save'});
            }else {
                res.status(500).send({album: albumStored});
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err) {
            console.log(err);
            res.status(500).send({message: 'server error'});
        }else {
            if (!albumUpdated){
                res.status(404).send({message: 'album didn`t updated'});
            }else {
                res.status(500).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
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
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });   
            }
        }
    });
}


function uploadImage (req, res) {
    var albumId = req.params.id;
    var fileName = 'not upload ...';

    if(req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'gif' || fileExt == 'jpg'){
            Album.findByIdAndUpdate(albumId, {image: fileName}, (err, albumUpdated) => {
                if (!albumUpdated) {
                    res.status(404).send({ message: "album not updated" });
                  } else {
                    res.status(200).send({ album : albumUpdated });
                  }
            });
        }else {
            res.status(404).send({ message: "invalid ext" });
          }
      }else {
        res.status(404).send({ message: "image not upload" });
      
    }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var pathFile = './uploads/albums/' + imageFile;
  fs.exists(pathFile, function(exist){
    if(exist){
      res.sendFile(path.resolve(pathFile));
    }else{
      res.status(200).send({ message: "image not exist" });
    }
  });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}