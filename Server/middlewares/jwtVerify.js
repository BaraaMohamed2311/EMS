const jwt = require("jsonwebtoken");


function jwtVerify(req , res , next){
    try{
        //accessing header
        const AuthHeader = req.headers.authorization;
        let verified = false;
        //extract token from header
        const token = AuthHeader.split(" ")[1];
        jwt.verify(token , process.env.SECRET_KEY , function(error){
            if(error){
                verified = false
            }
            else{
                verified = true
            }
        });

        if(!verified){
            return res.status(401).json({
                success:false,
                message:"Token Expired"
            })
        }

        // execute next middleware
            next();
        }
    catch(err){
        console.log("Error checking token ",err);
        res.json({
            success:false,
            message:"Error Checking Token"
        })
    }
}

module.exports = jwtVerify;