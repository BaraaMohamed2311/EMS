const jwt = require("jsonwebtoken");


function createJWTToken(id,email){
    try{
        const token = jwt.sign({id:id,email:email},process.env.SECRET_KEY,{ expiresIn: '30m' })
        return token
    }

    catch(err){
        consoleLog(`Error catch create Token ${err}` , err)
    }
    
}


module.exports = createJWTToken;