const webServer = require('./services/web-server.js');
const database = require('./services/database.js');
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4; 
const logger = require('./logger/logger');

process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

async function startup(){
	//Initialize the connection to the database
	try {
		logger.info('Initializing database module');

		await database.initialize();
		logger.info("Database connection was successfull");

	} catch(err){
		logger.info(err);

		process.exit(1); // Non-zero failure code 
	}

	logger.info('Starting application');

	try {
		logger.info('Initializing web server module');

		await webServer.initialize();
	} catch(err){
		logger.info(err);

		process.exit(1); // Non-zero failure code 
	}

}

startup();

async function shutdown(e){
	let err = e;

	logger.info('Shutting down');

	try {
		logger.info('Closing web server module');

		await webServer.close();
	} catch (e) {
		logger.info('Encountered error', e);

		err = err || e;
	}

	try{
		logger.info('Closing database module');

		await database.close();
	} catch (err) {
		logger.info('Encountered err', e);

		err = err || e;
	}

	logger.info('Exiting process');

	if(err){
		process.exit(1); //Non-zero failure code
	} else {
		process.exit(0);
	}

}

process.on('SIGTREM', ()=>{ 
	logger.info('Received SIGTERM');

	shutdown();
});

process.on('SIGINT', ()=>{ 
	logger.info('Received SIGINT');

	shutdown();
});

process.on('uncaughtException', err => { 
	logger.info('Uncaught exception');
	console.error(err);

	shutdown(err);
});
