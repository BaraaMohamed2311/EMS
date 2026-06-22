
function RoleVerify(req , res , next){
    try{
            req.body.user_email
            next();
        }
    catch(err){

        res.json({
            success:false,
            message:"Error Checking Token"
        })
    }
}

module.exports = RoleVerify;