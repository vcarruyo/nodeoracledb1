const express = require('express');
const router = new express.Router();
const instances = require('../controllers/instances.js');
const sessions = require('../controllers/sessions.js');
const sorteos = require('../controllers/sorteos.js');
const authentication = require('../config/auth.js');

//Ruta de autenticacion de usuario
router.route('/autenticacion')
	.post(sessions.post);

//Ruta ganadores de quiniela para un gameDayId
router.route('/ganadores/quiniela/:extGameDayId')
	.get(authentication.ensureAuthenticated, sorteos.get);

//Ruta para instancias de quiniela para un rango de gameDayId
router.route('/quiniela/instances/rango')
	.get(authentication.ensureAuthenticated, instances.get);




module.exports = router;