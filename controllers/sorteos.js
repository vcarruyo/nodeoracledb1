const winner = require('../db_apis/sorteos.js');

async function get(req, res, next){
	try{
		//Parametro para consulta a oracledb
        const context = {};

        context.extGameDayId = parseInt(req.params.extGameDayId, 10);
		
		//Conexion a db para consulta
		const rows = await winner.find(context);
        
        if(req.params.extGameDayId){
		if(rows.length >= 1){
				res.status(200).json({
					"prizes": rows,					
		})				
		} else {
		    res.status(404).json({"message":"No hay ganadores para este sorteo o el sorteo no existe"});
            }
        }    		
    }  catch (err){
		next(err);
	}
}

module.exports.get = get; 