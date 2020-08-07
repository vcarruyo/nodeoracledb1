const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const webServerConfig = require('../config/web-server.js');
const logger = require('../logger/logger');
const router = require('./router.js');

let httpServer;

function initialize(){
	return new Promise((resolve, reject) => {
		const app = express();
		
		app.use(bodyParser.urlencoded({extended: false}));
		app.use(bodyParser.json());
		//Combines logging info from request and response 
		app.use(morgan('combined'));
		app.use(cors());

		app.use('/api', router);
		
		app.get("*", function(req, res) {
			logger.info("users route");
			res.send("Esta ruta no es valida");
		})		
		httpServer = http.createServer(app);

		httpServer.listen(webServerConfig.port)
			.on('Listening', () => {
				logger.info(`Web server listening on localhost: ${webServerConfig.port}`);

				resolve();
			})
			.on('error', err => {
				reject(err);
			});
	});
}

module.exports.initialize = initialize; 


function close(){
	return new Promise((resolve, reject) => {
		httpServer.close((err) => {
			if(err){
				reject(err);
				return;
			}

			resolve();
		});
	});                                                  
}
module.exports.close = close; 



