
function RoleVerify(req , res , next){
    try{
            req.body.emp_email
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

module.exports = RoleVerify;