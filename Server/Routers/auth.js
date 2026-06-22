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
const consoleLog = require("../Utils/consoleLog.js");
const CompanyUsersMethods = require("../Classes/CompanyUsers/CompanyUsersMethods.js");
const generalUserMethods = require("../Utils/methods/generalUserMethods.js");
// =================================
//  Login User (Employees or Patients)
// =================================
    router.post("/login", async function(req, res) {
        try {
            // Extract request data
            const { user_email, password } = req.body;

            // --1. Bad Request if missing fields
            if(!user_email || !password) 
                return res.status(400).json({success:false,message:"Bad Request"});
            
            const userExists = await User.checkIfUserExistsByEmail(user_email);
            const userType = await User.getUserTypeByEmail(user_email);

            const userIsEmployee = userType === 'employee';

            if(!userExists || !userIsEmployee){
                return res.status(404).json({
                    success:false,
                     message : "User Not Found"
                });
            }
            
            // If employee, make sure he is hospital employee
            const isCompanyUser = userIsEmployee?  CompanyUsersMethods.isCompanyUser(await User.getUserTitleByEmail(user_email)) : false;
 
                // If he's employee but not as hospital staff then he has to register as patient first
                    if(!isCompanyUser && userIsEmployee){
                        return res.status(404).json({
                            success:false,
                            message : "Your title doesn't have access to this system"
                        });
                    }
            
            

            // --3. Get user data from the correct table and match password
            let user = null;
            let match = null
            // sets value to Patient as default value for 
            const result =await User.getUserIDAndTable(user_email);
            const user_id = result.user_id;
            const user_title =await User.getUserTitleByEmail(user_email);
            const isCompanyEmployee = CompanyUsersMethods.isCompanyUser(user_title)
            // get user's general data first , isLogin=true to get password as well
            user = await generalUserMethods.getUserData(user_id , true);

            // get user's employee data if he's employee
            const empData = await generalUserMethods.getUserEmpData(user_id);
            user = empData ? {...user , ...empData} : user;
            // get user's specific data if he's a specific table data
            const specificData = isCompanyEmployee ? await CompanyUsersMethods.MapUserToGETSpecificDataFunction(user_id, user_title) : null;

            user = isCompanyEmployee ? {...user , ...specificData} : user;

            // User must register as patient if he is not an employee and not registered as patient
            if(!userIsEmployee && !isCompanyEmployee){
                return res.status(404).json({
                    success: false,
                    message: 'Please, Register As Employee First'
                });
            }

            // Gets Perms Set and convert it to Array
            // Gets Role
            if(userIsEmployee && isCompanyEmployee && user){
                user.emp_perms =  Array.from(await User.getSetUserperms(user_id));
                user.role_name = await User.getUserRole(user_id)
            }

            if (!user || !user.user_password) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            match = await bcrypt.compare(password, user.user_password);

            // Compare request's password with hashed password
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: 'Passwords Do Not Match'
                });
            }


            // --4. Create JWT Token and send response without password
            const { user_password, ...userInfo } = user;
            const token = await createJWTToken(userInfo.user_id, userInfo.user_email);
            

            return res.status(200).json({
                success: true,
                body: { ...userInfo, token },
                message: "Successful Login"
            });


            
        } catch (err) {
            consoleLog(`Error in Logining`, "error");
            console.log(err)
            res.status(500).json({
                success: false,
                message: err.message || "Error in Logining"
            });
        }
    });
/************************************************************************************************************************/
    // Register
    router.post("/register",async function(req , res){
        try {
    
                let user = req.body;

                //Bad Request if
                if(!user.user_email || !user.user_password) return res.status(400 ).json({success:false,message:"Bad Request"});

                const check_unregistered_table = await isExist(`SELECT EXISTS(SELECT * FROM unregistered_employees WHERE user_email = ?) AS data_exists`, [user.user_email]);
                const check_users_table = await isExist(`SELECT EXISTS(SELECT * FROM users WHERE user_email = ? ) AS data_exists`, [user.user_email]);
                const check_employees_table = await isExist(`SELECT EXISTS(SELECT * FROM employees WHERE emp_id = ?) AS data_exists`, [check_users_table.user_id]);

                if (check_unregistered_table) {
                    return res.json({ success: false, message: "User Already staged & Waiting For Approval" });
                } else if (check_employees_table && check_users_table?.user_type === 'employee') {
                    return res.json({ success: false, message: "User Already Registered & Approved" });
                } 
                else if (check_users_table?.user_type === 'patient'){
                    return res.json({ success: false, message: "User already registered As patient, use another email" });
                }
                /* If user is not staged or registered before we start registering it */

            // assign hashed to user before preparing for inserting into db 

            user["user_password"] = await User.hashPassword(user["user_password"]);

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
            const query = `SELECT EXISTS(SELECT * FROM employees WHERE emp_id = ?) AS data_exists`;
            const exists  = await isExist(query,[emp_id]);
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
            const { user_email } = req.body;

            //Bad Request if
            if(!user_email) return res.status(400 ).json({success:false,message:"Bad Request"});



            // search for user inside employees table
            const query = `SELECT EXISTS(SELECT * FROM employees WHERE user_email = ?) AS data_exists`;
            const userinTable = await isExist(query,[user_email]);
            // USER NOT FOUND At EMPLOYEES TABLE
            if(!userinTable) 
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
                const isSent = await mailer("baraamohamed2311@gmail.com" ,user_email, "Password Reset" , reset_message);
                
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
            const {user_password} = req.body;
            // userId is Id of user document at mongodb and not the emp_id field
            const  {userId , resetToken} = req.params;


            //Bad Request if
            if(!user_password || !userId || !resetToken) return res.status(400 ).json({success:false,message:"Bad Request"});

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
                    const hashedPassword = await User.hashPassword(user_password);

                    const isReseted = await executeMySqlQuery(`UPDATE employees SET user_password = ? WHERE emp_id = ?`,[hashedPassword , resetTokenForUser.emp_id])
                    
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