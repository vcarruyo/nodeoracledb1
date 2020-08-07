const sessions = require('../db_apis/sessions');
const authentication  = require('../config/auth');
const crypto = require('crypto');

function generateHash (psw){
    let hash = crypto.createHash('md5').update(psw).digest("hex");
    return hash;
}

function xorDecode (decodedString) {
    let xor_mask = "foobar";
    let out;
    var arrayPass = new Uint16Array(decodedString.length);
          
    for (var i = 0; i < decodedString.length; i++){
        arrayPass[i] = decodedString.charCodeAt(i);            
        
        var bytPos = i % xor_mask.length;
        var bytKey = (xor_mask.substr(bytPos, 1)).charCodeAt(0);
        
        var intEnc = arrayPass[i];
        var intEnc = intEnc - bytKey - (xor_mask.length - bytPos) + 1;
                    
        if ( intEnc < 0 )
            intEnc = intEnc + 255;
               
            intEnc = (intEnc ^= bytKey);
            
            arrayPass [i] = intEnc;
            }
            arrayPass [i] = '\0';
            out = String.fromCharCode.apply(null, arrayPass);
            
            return out;
        }

function decrypt (sPwdEncrypted) {           
    // Decode base64 string to binary (ISO-8859-1)
    var decodedString = Buffer.from(sPwdEncrypted, 'base64').toString('binary');
            
    // Decrypt password using XOR
    var decryptedString = xorDecode(decodedString);
    var dbHash = generateHash(decryptedString);
    return dbHash;
}

async function post(req, res, next){
	try {
        
        let dbHashedMD5;
        let passHashedMD5;
        
        let upperCaseUser = req.body.username.toUpperCase();
        let upperCasePsw = req.body.password.toUpperCase();

        const context = {};

        context.username = upperCaseUser;
        context.password = upperCasePsw;
        
        //Conexion con db para verificar datos de usuario
		const rows = await sessions.find(context);
        
		if(rows.length === 1){
        dbHashedMD5 = decrypt(rows[0]["PASSWORD"]);
        passHashedMD5 = generateHash(context.password);
        
        //Comparación de contraseña ingresada por usuario y la almacenada en la db
        if(passHashedMD5 == dbHashedMD5){
        let user = {username: context.username};
	    res.status(200).send({
            access_token: authentication.createAccessToken(user),
            message:"Usuario registrado correctamente",
            user: rows[0]["USERNAME"],                        
            });
        } else {
            res.status(404).send({message: "Contraseña invalida"});
        }
    } else {res.status(404).send({message: "Usuario invalido"}); }
        
	} catch (err){
		next(err);
	}
}

module.exports.post = post; 