const jwt = require('jsonwebtoken');
const jwtJson = require('./jwt');

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(!req.headers.authorization){
      res.status(401).json({message: 'Usted no ha sido autorizado'});
      return;
    }
  
    //Extraccion del token de la cabecera de la petición
    const bearerheader = req.headers.authorization;
    if(typeof bearerheader !== "undefined"){
    const bearer = bearerheader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    } else {
        res.sendStatus(403);
    }

    //Comprobacion del token recibido en la petición
     jwt.verify(req.token, jwtJson.secret, function(err){
        if(err){
          if(err.name === 'TokenExpiredError'){
            res.status(401).json({message: 'Su token ha expirado'});
          } else {
            res.status(401).json({message: 'Autenticacion Fallida'});
          }
          return 
        }
    next();				
    });
  },   
  
  createAccessToken: function (user) {
    return jwt.sign({
          iss: jwtJson.issuer,
          aud: jwtJson.audience,
          data: user           
      }, jwtJson.secret, {expiresIn: 6000});
  }
};