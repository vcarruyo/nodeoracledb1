const instances = require('../db_apis/instances.js');
const _ = require('lodash');
const moment = require('moment');

//Dar formato de fecha YYYY-MMM-DD HH:mm:ss a respuesta de oracledb
function fixDate(dateTo){
	let date = new Date(dateTo);
	let fixedDate = moment(date).format('YYYY-MMM-DD HH:mm:ss');
	let ufixedDate = fixedDate.toUpperCase();
	return ufixedDate;
}

async function get(req, res, next){
	try{
		//Parametros de busqueda para la consulta a oracledb
		const context = {};

        context.extGameDayFrom = req.query.extGameDayFrom;
		context.extGameDayTo = req.query.extGameDayTo;
		console.log(context);
		
		//Conexion a db para consulta
		const rows = await instances.find(context);

		//Agrupacion de instancias por gameDayId usando libreria lodash
		var grouped = _.mapValues(_.groupBy(rows[1]["rows"], 'GAMEDAY_ID'), clist => clist.map(instances => _.omit(instances, 'GAMEDAY_ID','PROV_ID','GD_EXT_GAMEDAY_ID')));
	


		//Array con las claves de las instancias por cada gameDayId para su posterior iteracion
		let keysArray = Object.keys(grouped);
		
		
		//Copia profunda de respuesta de oracledb para generación de json
		const deepCloneRows = _.cloneDeep(rows[0]["rows"]);
				
        if(res.statusCode == 200 && rows[0]["rows"].length>0){
			for(let i=0; i<rows[0]["rows"].length; i++){
			let gameDay = rows[0]["rows"];
			gameDay[i] = {
			"gameDay": {
						"gameDayid" : gameDay[i]["gameDayid"],
						"externalGameDayId":  gameDay[i]["externalGameDayId"],
						"game": {
								"gameCode": gameDay[i]["gameCode"],
								"gameName": gameDay[i]["gameName"],
								"gameShortName": gameDay[i]["gameShortName"],
								"gamePrefix": gameDay[i]["gamePrefix"]
								},
						"attributes": {
										"gameDayDaily": {},
										"gameDayType": {}, 		
										"betMinPrice": gameDay[i]["betMinPrice"]*100,
										"betMaxPrice": gameDay[i]["betMaxPrice"]*100
										},
						"schedule":{
									"saleOpenDateTime": fixDate(gameDay[i]["saleOpenDateTime"]),
									"saleCloseDateTime": fixDate(gameDay[i]["saleCloseDateTime"]),
									"expirationDateTime": fixDate(gameDay[i]["expirationDateTime"]),
									"drawScheduledDateTime": fixDate(gameDay[i]["drawScheduledDateTime"]),
									},
					"Instances": grouped[keysArray[i]] //Anidado de instancias por cada gameDayID  											
					}								
				
				}
				//Anidar gameDayDaily Diario o Sabado por cada gameDayId
				if(deepCloneRows[i]["gameDayDailyName"]=="Diario"){
				rows[0]["rows"][i]["gameDay"]["attributes"]["gameDayDaily"][1]=deepCloneRows[i]["gameDayDailyName"]; 
					let gameDayType = rows[0]["rows"][i]["gameDay"]["attributes"]["gameDayType"];	
					//Anidar gameDayType de acuerdo al gameDayDaily Diario
					switch(deepCloneRows[i]["gameDayTypeName"]){					
						case "Matutino":
						gameDayType[0]=deepCloneRows[i]["gameDayTypeName"];
						break;
						case "Vespertino":
						gameDayType[1]=deepCloneRows[i]["gameDayTypeName"];
						break;
						case "Uruguay":
						gameDayType[2]=deepCloneRows[i]["gameDayTypeName"];
						break;
						case "Nocturno":
						gameDayType[3]=deepCloneRows[i]["gameDayTypeName"];
						break;
						case "Especial":
						gameDayType[4]=deepCloneRows[i]["gameDayTypeName"];
						break;
						case "Primera":
						gameDayType[5]=deepCloneRows[i]["gameDayTypeName"];
						break;
					}
				} else if(deepCloneRows[i]["gameDayDailyName"]=="Sabado"){
					rows[0]["rows"][i]["gameDay"]["attributes"]["gameDayDaily"][0]=deepCloneRows[i]["gameDayDailyName"]; 
						let gameDayType = rows[0]["rows"][i]["gameDay"]["attributes"]["gameDayType"];	
						//Anidar gameDayType de acuerdo al gameDayDaily Sabado
						switch(deepCloneRows[i]["gameDayTypeName"]){					
							case "Matutino":
							gameDayType[20]=deepCloneRows[i]["gameDayTypeName"];
							break;
							case "Vespertino":
							gameDayType[21]=deepCloneRows[i]["gameDayTypeName"];
							break;
							case "Uruguay":
							gameDayType[22]=deepCloneRows[i]["gameDayTypeName"];
							break;
							case "Nocturno":
							gameDayType[23]=deepCloneRows[i]["gameDayTypeName"];
							break;
							case "Especial":
							gameDayType[24]=deepCloneRows[i]["gameDayTypeName"];
							break;
							case "Primera":
							gameDayType[25]=deepCloneRows[i]["gameDayTypeName"];
							break;
						}
				}
			}
						
			res.status(200).json({"gameDay": rows[0]["rows"]})


		} else if(rows[0]["rows"]==0){
			res.status(404).json({"message":"No hay instancias para este rango"});
        }          		
    }  catch (err){
		next(err);
	}
}

module.exports.get = get; 