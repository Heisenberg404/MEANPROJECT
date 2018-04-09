"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_key_code";

exports.ensureAuth = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "missing headers" });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: "expire token" });
    }
  } catch (error) {
    return res.status(404).send({ message: "invalid token" });
  }
  //se almacena el objeto user dentro del request y tenerlo disponible dentro cualquier peticion
  req.user = payload;
  //se continua el flujo normal de aplicacion
  next();
};
