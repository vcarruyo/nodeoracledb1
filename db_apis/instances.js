const database = require('../services/database.js');

const baseQuery1 =
`SELECT DISTINCT GD.GAMEDAY_ID "gameDayid",
GD.GD_EXT_GAMEDAY_ID "externalGameDayId",
GAP.GAP_GAME_CODE  "gameCode", 
TRIM(GAP.GAP_GAME_NAME) "gameName",
'La Quiniela' "gameShortName",
'QNL' "gamePrefix",
--Attributes
GT.GT_DAILY "gameDayDaily",
DECODE(GT.GT_DAILY, 1, 'Diario', 'Sabado') "gameDayDailyName",
GD.GD_GAMEDAY_TYPE "gameDayType",
GT.GT_DESCRIPTION "gameDayTypeName",
GAP_MIN_PRICE "betMinPrice",
GAP_MAX_PRICE "betMaxPrice",
--Schedule
GI.GI_OPENDATE_ONLINE "saleOpenDateTime",
GI.GI_CLOSEDATE_ONLINE "saleCloseDateTime",
Gi.GI_PRIZE_EXPIRATION_DATE "expirationDateTime",
LR.LR_LOTRACE_DATE "drawScheduledDateTime"
FROM GAME_DAY GD,
game_instance_v GI,
LOT_RACE LR,
game_params gap,
gameday_type GT
WHERE GD.GD_GAME_CODE = 80
AND GD.GD_GAME_CODE  = GI.GI_GAME_CODE
AND GD.GAMEDAY_ID = GI.GI_GAMEDAY_ID
AND GD.gameday_id = LR.LR_GAMEDAY_ID
AND GI.GI_GAMEINSTANCE_ID = LR.LR_LOTRACE_ID
AND GAP.gap_game_code = GD.GD_GAME_CODE
AND GD.GD_GAMEDAY_TYPE = GT.GT_GAMEDAY_TYPE_ID
AND GD.GD_EXT_GAMEDAY_ID BETWEEN :EXT_GAMEDAY_ID_FROM AND :EXT_GAMEDAY_ID_TO
ORDER BY 1,3,4`;

const baseQuery2 =
`SELECT GAMEDAY_ID,
GAMEINSTANCE_ID + 1 "id",
PROV_ID, 
GD_EXT_GAMEDAY_ID,
NVL(PROV_NAME, 'Uruguay') "name" FROM (
SELECT PROVINCES_GAMEINSTANCE.GAMEDAY_ID,
 PROVINCES_GAMEINSTANCE.GAMEINSTANCE_ID,
 PROVINCES_GAMEINSTANCE.PROV_ID, 
 GAME_DAY.GD_EXT_GAMEDAY_ID, 
 (SELECT TRIM(ohi_instance_name) FROM operation_hierarchy_instance
 WHERE ohi_extern_instance_id = PROV_ID        
 AND ohi_instance_type = 2) PROV_NAME 
 FROM PROVINCES_GAMEINSTANCE, GAME_DAY
 WHERE PROVINCES_GAMEINSTANCE.GAME_CODE = 80
 AND PROVINCES_GAMEINSTANCE.GAMEDAY_ID = GAME_DAY.GAMEDAY_ID
 AND GAME_DAY.GD_EXT_GAMEDAY_ID BETWEEN :EXT_GAMEDAY_ID_FROM AND :EXT_GAMEDAY_ID_TO
ORDER BY 1, 2, 3)`;

async function find(context){
    let query1 = baseQuery1;
    let query2 = baseQuery2
    const binds = {};

    binds.EXT_GAMEDAY_ID_FROM = context.extGameDayFrom;
    binds.EXT_GAMEDAY_ID_TO = context.extGameDayTo;
    
    const result = {};
    result[0] = await database.simpleExecute(query1, binds);
    result[1] = await database.simpleExecute(query2, binds);
    
    return result;     	
     
}
module.exports.find = find; 





