'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

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
    user.role = 'ROLE_ADMIN';
    user.email = params.email;

    if(params.password) {
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if (user.name !== null && user.surname !== null && user.email !== null) {
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: "Error saving the user"});
                    }else {
                        if (!userStored) {
                            res.status(400).send({message: "User not saved"});
                        }else {
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else {
                res.status(200).send({message: "missing pas!"});
            }
        });
    }else {
        res.status(200).send({message: "missing password!"});
    }

}

module.exports = {
    prueba,
    saveUser
};