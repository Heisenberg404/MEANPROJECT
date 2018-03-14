'use strict'

function prueba(req, res) {
    res.status(200).send({
        message: "tested!!"
    });
}

module.exports = {
    prueba
};