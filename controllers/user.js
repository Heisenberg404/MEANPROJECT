"use strict";
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
var jwt = require("../services/jwt");
var fs = require("fs");
var path = require("path");

function prueba(req, res) {
  res.status(200).send({
    message: "tested!!"
  });
}

function saveUser(req, res) {
  var user = new User();
  var params = req.body;

  user.name = params.name;
  user.sername = params.surname;
  user.image = null;
  user.role = "ROLE_ADMIN";
  user.email = params.email;

  if (params.password) {
    bcrypt.hash(params.password, null, null, function(err, hash) {
      user.password = hash;
      if (user.name !== null && user.surname !== null && user.email !== null) {
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: "Error saving the user" });
          } else {
            if (!userStored) {
              res.status(400).send({ message: "User not saved" });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: "missing pass!" });
      }
    });
  } else {
    res.status(200).send({ message: "missing password!" });
  }
}

function loginUser(req, res) {
  var params = req.body;
  var email = params.email;
  var password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: "Error getting the user" });
    } else {
      if (!user) {
        res.status(404).send({ message: "User not exist" });
      } else {
        //check password
        bcrypt.compare(password, user.password, function(err, check) {
          if (check) {
            //return data user logged
            if (params.gethash) {
              //devolver token de JWT
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res
              .status(404)
              .send({ message: "El usuario no ha podido loguearse" });
          }
        });
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var ojbUpdate = req.body;

  User.findByIdAndUpdate(userId, ojbUpdate, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: "error updating user" });
    } else {
      if (!userUpdated) {
        res.status(404).send({ message: "user not updated" });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
}

function uploadImage (req, res) {
    var userId = req.params.id;
    var fileName = 'not upload';

    if(req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'gif' || fileExt == 'jpg'){
            User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({ message: "user not updated" });
                  } else {
                    res.status(200).send({ image: fileName, user: userUpdated });
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
  var pathFile = './uploads/users/' + imageFile;
  fs.exists(pathFile, function(exist){
    if(exist){
      res.sendFile(path.resolve(pathFile));
    }else{
      res.status(200).send({ message: "image not exist" });
    }
  });
}

module.exports = {
  prueba,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
