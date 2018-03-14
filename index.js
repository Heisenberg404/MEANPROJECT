'use strict'

var mongoose = require ('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/test', (err, res) => {
    if (err) {
        throw err;
    }else {
        console.log('connected to bd');

        app.listen(port, function(){
            console.log("server up in port: " + port);
        });
    }
});