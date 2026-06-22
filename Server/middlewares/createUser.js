
const Employees_Img_module = require("../Models/Profile_Pic");
async function createUser(req , res , next){

    let old_employee = await Employees_Img_module.findOne({user_email:req.query["user_email"]});
    // if user isn't exist we create it 
    if(!old_employee){
        let user  = await new Employees_Img_module({
            user_email:req.query["user_email"],
            emp_pic:{
                file_name:"",
                ImgId:"", // we didn't assign image yet
            }
        })

        await user.save(); // save to db

        
    }
    
    next();
}



module.exports = createUser;