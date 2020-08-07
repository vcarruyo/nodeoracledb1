const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');
const logger = require('../logger/logger');

async function initialize(){
	await oracledb.createPool(dbConfig.hrPool);
	logger.info("Connection was successfull");
}

module.exports.initialize = initialize;

async function close(){
	await oracledb.getPool().close();
}

module.exports.close = close; 

function simpleExecute(statement, binds = [], opts ={}){
	return new Promise(async(resolve, reject)=>{
		let conn;
		
		opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
		opts.autoCommit = true;
		try{
			conn = await oracledb.getConnection();

			const result = await conn.execute(statement, binds, opts);
			logger.info(`Consulta exitosa ${JSON.stringify(binds)}`);

			resolve(result);
		} catch (err){
			reject(err);
		} finally {
			if(conn){ //conn assignment worked, need to close
				try{
					await conn.close();
				} catch (err){
					logger.info(err);
				}
			}
		}
	});
}

module.exports.simpleExecute = simpleExecute;