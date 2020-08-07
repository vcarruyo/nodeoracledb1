const database = require('../services/database.js');


const baseQuery =
`SELECT TI_GAMEDAY_ID "gameDayid",
TI_GAME_CODE "gameCode", 
GD_EXT_GAMEDAY_ID "externalGameDayId",
TI_TICKET_NUM "ticketId", 
TI_PRIZE_AMOUNT*100 "prize"
FROM TICKETS_QUINIELA, GAME_DAY
WHERE GD_GAME_CODE = 80 
AND GD_EXT_GAMEDAY_ID = :EXT_GAMEDAY_ID
AND GAMEDAY_ID = TI_GAMEDAY_ID
AND TI_PRIZE_AMOUNT > 0
ORDER BY TI_TICKET_NUM`;

async function find(context){
    let query = baseQuery;
    const binds = {};

    if(context.extGameDayId){
    binds.EXT_GAMEDAY_ID = context.extGameDayId;

    //Conexion, consuta y cierre de conexion a oracledb
    const result = await database.simpleExecute(query, binds);
	return result.rows;    	
    } 
}
module.exports.find = find; 





