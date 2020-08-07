const database = require('../services/database.js');

const baseQuery =
`SELECT HU_USERNAME "USERNAME",
    HU_PASSWORD "PASSWORD"	
FROM HOST_USERS`;

async function find(context){
        let query = baseQuery;
        const binds = {};
        query = query + `\nWHERE HU_USERNAME = :HU_USERNAME`; 
        
        binds.HU_USERNAME = context.username;
                            
        const result = await database.simpleExecute(query, binds);
        
        return result.rows;
    
    }
	
module.exports.find = find; 





