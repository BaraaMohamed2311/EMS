const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtVerify = require("../middlewares/jwtVerify.js")
const createJWTToken = require("../Utils/createJWTToken.js");
const isExist = require("../Utils/isExist.js");
const executeMySqlQuery = require("../Utils/executeMySqlQuery.js");
const User = require("../Classes/User.js");
const fixedFields = require("../Utils/fixedFields.js");
const mailer = require("../Utils/mailer.js");
const ResetPasswordTokensModel = require("../Models/ResetPassword.js");
const crypto = require("crypto");
const consoleLog = require("../Utils/consoleLog.js")
    // Login
    router.post("/login", async function(req, res) {
        try {
            // Extract request data
            const { emp_email, password } = req.body;

            if(!emp_email || !password) 
                return res.status(400).json({success:false,message:"Bad Request"});
            

            let user = await executeMySqlQuery(`SELECT * FROM employees WHERE emp_email = ?`,[emp_email])

            if ( user.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found"
                });
            }
            
            
            // get user role and send to response
            user[0].role_name =  await User.getUserRole(user[0].emp_id);

            user[0].emp_perms =  await User.getUserperms(user[0].emp_id);


            // Compare request's password with hashed password
            const match = await bcrypt.compare(password, user[0].emp_password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: 'Passwords Do Not Match'
                });
            }


            


            const { emp_password, ...userInfo } = user[0];
            const token = await createJWTToken(userInfo.emp_id, userInfo.emp_email);
            

            return res.status(200).json({
                success: true,
                body: { ...userInfo, token },
                message: "Successful Login"
            });


            
        } catch (err) {
            consoleLog(`Error in Logining ${err}`, "error");
            res.status(500).json({
                success: false,
                message: "Error in Logining"
            });
        }
    });
/************************************************************************************************************************/
    // Register
    router.post("/register",async function(req , res){
        try {
    
                let user = req.body;

                //Bad Request if
                if(!user.emp_email || !user.emp_password) return res.status(400 ).json({success:false,message:"Bad Request"});

                const check_unregistered_table = await isExist(`SELECT * FROM unregistered_employees WHERE emp_email = ?`,[user.emp_email]);
                const check_employees_table = await isExist(`SELECT * FROM employees WHERE emp_email = ?`,[user.emp_email]);

                if (check_unregistered_table.exists) {
                    return res.json({ success: false, message: "User Already staged & Waiting For Approval" });
                } else if (check_employees_table.exists) {
                    return res.json({ success: false, message: "User Already Registered & Approved" });
                } 
                /* If user is not staged or registered before we start registering it */

            // assign hashed to user before preparing for inserting into db 
            user["emp_password"] = await User.hashPassword(user["emp_password"]);

            // make entries array of hashed user
            let request_entries = Object.entries(user);
            /***************************************/ 
            
            let columns_field = "";
            let values_field = "";
            request_entries.forEach(([key , value ],indx)=>{
                columns_field += key;
                
                if(typeof value == 'string'){
                    // make sure to add the hashed password to db and not the original
                    values_field += `"${value}"`
                }
                if(indx !== request_entries.length - 1){
                    columns_field += ",";
                    values_field += ","
                }
                    
            })
            /***************************************/ 
  
            // this time we insert to unregistered_employees where they are staged & waiting for approval
            const query = `INSERT INTO unregistered_employees (${columns_field}) VALUES (${values_field})`


            const registered = await executeMySqlQuery( query );

            if(registered){
                res.json({success:true,message:"Successfully Staged Employee To Wait List"})
            }
            else{
                res.json({success:false,message:"Failed Staging Employee To Wait List"})
            }
        
        }
        catch (err) {
            console.error("Error In Registering New User" ,err)
            res.json({
                success:false,
                message:"Error In Registering New User"
            })
        }
    })

    /************************************************************************************************************************/
    // update-user
    router.put("/update-user",async function(req , res){
        try {
            // no need to worry about user updating his role and perms as it's a different table for both
            let {emp_id , ...userData} = req.body;


            //Bad Request if
            if(!emp_id) return res.status(400 ).json({success:false,message:"Bad Request"});



            // first check user exists 
            const query = `SELECT * FROM employees WHERE emp_id = ?`
            const { exists } = await isExist(query,[emp_id]);
            // make sure to remove fields that cannot be changed by user 
            userData = fixedFields(userData);
            if(exists){
                User.editUserData(emp_id , Object.entries(userData));
                res.json({
                    success:true,
                    message:"Your Data Updated Successfully"
                })
            }
            else{
                res.status(404).json({
                    success:false,
                    message:"User Couldn't be Found"
                })
            }
            
        }
        catch (err) {
            consoleLog(`Error update-user Data Path ${err}` , "error")
            res.status(500).json({
                success:false,
                message:"Error Updating Your Data Path"
            })
        }
    })

/************************************************************************************************************************/
    // forget password
    router.post("/forget-password",async function(req , res){
        try{   
            const { emp_email } = req.body;

            //Bad Request if
            if(!emp_email) return res.status(400 ).json({success:false,message:"Bad Request"});



            // search for user inside employees table
            const query = `SELECT * FROM employees WHERE emp_email =?`
            const userinTable = await isExist(query,[emp_email]);
            // USER NOT FOUND At EMPLOYEES TABLE
            if(!userinTable.exists) 
                res.status(404).json({
                    success:false,
                     message : "User Not Found"
                });

            let User = await ResetPasswordTokensModel.findOne({ emp_id: userinTable.data.emp_id });
            // User Found IN Table But NOT FOUND IN MONGODB We create A document for him
            if(!User) {
                User = new ResetPasswordTokensModel({
                    emp_id:userinTable.data.emp_id,
                    ResetToken: "",
                })
            }
                
                // generate Reset Password Token
                const reset_token = crypto.randomBytes(20).toString('hex');
                // set user reset token and it's time of creation
                User.ResetToken = reset_token;
                
                User.createdAtToken =  new Date();
                // save to data base
                await User.save()
                // send link of reset
                //"/reset-password/:userid/:token"
                const reset_message = `Your request to reset your password was recieved,
                 Now you have to visit this link to reset your password to a new one : ${process.env.RESETPASSPATH}/${User._id}/${reset_token}`
                //(SendFrom , SendTo , subject , text)
                const isSent = await mailer("baraamohamed2311@gmail.com" ,emp_email, "Password Reset" , reset_message);
                
                    if(isSent){
                        res.status(200).json({success:true,message:"Reset Password Link Was Sent"});
                    }
                    else{
                        res.status(501).json({success:false,message:"Reset Password Link Wasn't Sent"});
                    }
        }
        catch(err){
            consoleLog( `Forgot Password Error : ${err} ` , "error" );
            res.status(500).json({
                success: false ,
                message : `Error Sending Reset Password Link`
                })
        }
    })

    // reset password
    router.put("/reset-password/:userId/:resetToken",async function(req ,res){
        try{
            const {emp_password} = req.body;
            // userId is Id of user document at mongodb and not the emp_id field
            const  {userId , resetToken} = req.params;


            //Bad Request if
            if(!emp_password || !userId || !resetToken) return res.status(400 ).json({success:false,message:"Bad Request"});

            // get token & creation date & emp_id from mongodb
            const resetTokenForUser = await ResetPasswordTokensModel.findOne({ _id:userId });

            // passing created token at to new date class
            let DateInstance = new Date(resetTokenForUser.createdAtToken);
            let created_Token_at = {hour :DateInstance.getHours(),day:DateInstance.getDate()};

            // USER NOT FOUND 
            if(!resetTokenForUser) 
                res.status(404).json({
                    success:false,
                     message : "User Not Found"
                });

                /*Defining lifeTime in hours and get current time and day object */
                let token_lifetime = 1; // hour
                let current_Time = {hour :new Date().getHours(),day:new Date().getDate()};
                
                
                // check if token from url is same as in db & check resettoken created at db life time
                if(resetToken === resetTokenForUser.ResetToken && 
                   created_Token_at.hour + token_lifetime >= current_Time.hour && 
                   created_Token_at.day === current_Time.day){
                    
                    // then token is still valid and we save new password into db
                    const hashedPassword = await User.hashPassword(emp_password);

                    const isReseted = await executeMySqlQuery(`UPDATE employees SET emp_password = ? WHERE emp_id = ?`,[hashedPassword , resetTokenForUser.emp_id])
                    
                    if(isReseted){
                        res.status(200).json({
                            success:true,
                            message : "Password Was Updated Successfully"
                        });
                     }
                     else{
                        res.status(500).json({
                            success:false,
                            message : "Password Was Not Updated"
                        });
                     }
                }
                else{
                    res.status(501).json({
                        success:false,
                         message : "Password Wasn't Updated (Unvalid token)"
                    });
                }
            
        }
        catch(err){
            console.log("reset password Error : " , err );
            res.status(500).json({
                success: false ,
                message : `Error Updating Password`
                })
        }
    })

    

    // private routes authentication
    router.post("/private-route",jwtVerify , (req , res)=>{
        try{
            res.status(200).json({success:true , message:"You Are Authorized"})
        }
        catch(err){
            res.status(500).json({success:false , message:"Error In Private Routes"})
        }
    })

module.exports = router;