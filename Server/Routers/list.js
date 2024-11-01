const router = require("express").Router();
const jwtVerify = require("../middlewares/jwtVerify.js");
const User = require("../Classes/User.js");
const perms = require("../Classes/perms.js");
const SuperAdmin = require("../Classes/SuperAdmin.js");
const Admin = require("../Classes/Admin.js");
const stringifyFields = require("../Utils/stringifyFields.js");
const executeMySqlQuery = require("../Utils/executeMySqlQuery.js");
const JoinFiltering = require("../Utils/JoinFiltering.js");
const consoleLog = require("../Utils/consoleLog.js");
const mailer = require("../Utils/mailer.js")
/*Admins who can access List page are 2 roles => read-only admin & full access admin*/

// GET Employees Data
router.get("/employees",jwtVerify,async (req,res)=>{
    try{
        const { pagination, size , emp_id, role_name, emp_perms, ...restFilters } = req.query;
        
        //Bad Request if modifier id or others doesn't exist
        if(!pagination || !size || !emp_id ) return res.status(400).json({success:false,message:"Bad Request"});

        

        const Modifier_role = await User.getUserRole(emp_id);
        const Modifier_perms = new perms(await User.getUserperms(emp_id));

    if (Modifier_role === "Employee") {
        return res.status(401).json({ success: false, message: "Employee Role cannot access The list" });
    }


    /** Define Joining TYPE  **/
    // if we left joining no need to add on conditions as not all users are going to exist in employee and other tables
    const roles_JOIN = !role_name || role_name === "Employee"  ? " LEFT JOIN roles r ON e.emp_id = r.emp_id " : " JOIN roles r ON e.emp_id = r.emp_id " ;
    const perms_JOIN = emp_perms ? " JOIN employee_perms ep ON e.emp_id = ep.emp_id \n JOIN perms p  ON ep.perm_id = p.perm_id " : "  LEFT JOIN employee_perms ep ON e.emp_id = ep.emp_id \n LEFT JOIN perms p ON ep.perm_id = p.perm_id  ";

    /**  Filter Conditions **/
    const Rest_CONDITION = restFilters ? JoinFiltering(Object.entries(restFilters),"e") : "" ;
    const roles_CONDITION = !role_name || role_name === "Employee" ? "" : JoinFiltering(Object.entries({role_name:role_name}),"r") ;
    // filtering gouped values on perms will be done using HAVING keyword & FIND_IN_SET which searches for string in string seperated by ", "
    const perms_CONDITION = emp_perms ? `
            HAVING 
            FIND_IN_SET('${emp_perms}', GROUP_CONCAT(DISTINCT p.perm_name)) > 0 ` : "";

    /**  Is Accessible Conditions **/
    // default value of those columns would be '' if user doen't have their perms
    // logically if user have permission to modify salary then he could see it but other props like roles, perms he can see it anyway even with no role to modify
    const access_salary = (Modifier_perms.isPermExist("Modify Salary") || Modifier_perms.isPermExist("Display Salary")) ? " e.emp_salary, e.emp_bonus " : " '' AS emp_salary , '' AS emp_bonus "

    // Build the final query
    /* roles filtering exists any way no need to check*/
    /* we group rows instead of repeating for each new perm */
    const query = `
      SELECT 
        e.emp_id, 
        e.emp_name, 
        COALESCE(NULLIF(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', '), ''), 'None') AS emp_perms, 
        COALESCE(NULLIF(r.role_name, ''), 'Employee') AS role_name, 
        e.emp_abscence, 
        e.emp_rate, 
        e.emp_position, 
        e.emp_email,
        ${access_salary} 
        FROM employees e 
        ${roles_JOIN}
        ${perms_JOIN}
        ${roles_CONDITION || Rest_CONDITION ? " WHERE " : ""} 
        ${Rest_CONDITION}
        ${roles_CONDITION && Rest_CONDITION ? " AND " : ""}
        ${roles_CONDITION}
        GROUP BY 
            e.emp_id, e.emp_name, r.role_name, e.emp_abscence, e.emp_rate, e.emp_position, e.emp_email, e.emp_salary, e.emp_bonus
        ${perms_CONDITION}
        LIMIT ? OFFSET ?`;
        // last to parameters are linilt & offset
      const users = await executeMySqlQuery(query , [ parseInt(size) , parseInt((pagination - 1) * size )]);

      if( users && users.length > 0){
        res.status(200).json({success : true , body:users, message:"Successfully Fetched Data"})
      }
      else{
        res.status(404).json({success : false , message:"No Users Found !"})
      }
    
        
        
    }
    catch(err){
        console.error("Error List Employees Profile Data",err);
        res.status(500).json({
            success:false,
            message:"Error List Employees Data"
        })
    }
})

/************************************************************************************************/

    router.put("/update-others",jwtVerify ,async function(req , res){
        try {   
                // Let & not Const becase they get modified
                    let { modifier_id , emp_id , other_emp_email , role_name : newRole, emp_perms : newperms ,   ...userData} = req.body;
                // Actions
                    let {actions} = req.query;
                    actions = actions.split("-")
                // Bad Request
                if(!actions || !modifier_id || !emp_id ) 
                    return res.status(400 ).json({success:false,message:"Bad Request"});

                    let failing_messages = [];
                    console.log("action ", actions )
                    // then modifier is different user 
                    const modifierRole = await User.getUserRole(modifier_id);
                    const userRole = await User.getUserRole(emp_id );

                    // if modifier have same role or higher and permession he can update others
                    const  modifierperms = await User.getUserperms(modifier_id);
                    // create set instance of it 
                    let modifierSetperms = new perms(modifierperms);
                    
/************************************************************************Data Update*********************************************/
                    if(actions.includes("Modify Data")){
                        if(modifierSetperms.isPermExist("Modify Data")){
                            // If  no "Modify Salary" perm we remove salary field to ensure not editing it
                            userData = modifierSetperms.isPermExist("Modify Salary") ? userData : delete userData.emp_salary ;
                            
                            if(modifierRole === "SuperAdmin"){
                                const succeeded = await SuperAdmin.EditOtherUser(emp_id ,userRole , Object.entries(userData))
                                    if(!succeeded){
                                        failing_messages.push({success:false , message: "You Have To Be Admin Or SuperAdmin"})
                                    }
                            }
                            else if (modifierRole === "Admin"){
                                const succeeded = await Admin.EditOtherUser(emp_id ,userRole , Object.entries(userData)  )
                                    if(!succeeded){
                                        failing_messages.push({success:false , message: "Failed To Modify User Data"})
                                    }
                                    
                            }
                        }
                        else{ 
                            failing_messages.push({success:false , message: "Not Allowed To Modify User Data"})
                        }
                    }
                    
                    
/***************************************************************Role Update*********************************************/
                    if(actions.includes("Modify Role")){
                            if(modifierSetperms.isPermExist("Modify Role")){
                                // Modidify Role
                        if(modifierRole === "SuperAdmin"){
                            const succeeded =await SuperAdmin.ChangeOtherUserRole(emp_id , userRole , newRole , other_emp_email)
                                if(!succeeded){
                                    failing_messages.push({success:false , message: "Failed To Modify User Role"})
                                }
                        }
                            }
                            else{
                                failing_messages.push({success:false , message: "Not Allowed To Modify User Role"});
                            }
                    }
/**************************************************************perms Update*********************************************/
                    if(actions.includes("Modify Perms")){
                        if (modifierSetperms.isPermExist("Modify Perms")){
                            // Modidify perms
                            const oldUserperms = await executeMySqlQuery(`SELECT COALESCE((SELECT COALESCE(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', ') , 'None') FROM perms p JOIN employee_perms ep ON p.perm_id = ep.perm_id WHERE ep.emp_id =${emp_id}), 'None') AS perm_name;`,"Error Getting Old User perms");
                            const oldUserpermsSet=new Set( oldUserperms[0].perm_name.split(", ")) ;
                            if(modifierRole === "SuperAdmin"){
                                const succeeded =await SuperAdmin.ChangeOtherUserperms(emp_id , userRole , newperms , oldUserpermsSet)
                                    if(!succeeded){
                                        failing_messages.push({success:false , message: "Failed To Modify User perms"})
                                    }
                            }
                        }
                        else{ 
                            failing_messages.push({success:false , message: "Not Allowed To Modify User Permissions"})
                        }
                    }
                    
/*********************************************************************************************************************/
                    // making sure not sending salary details if user has no perm
                    const access_salary = (modifierSetperms.isPermExist("Modify Salary") || modifierSetperms.isPermExist("Display Salary")) ? " e.emp_salary, e.emp_bonus " : " '' AS emp_salary , '' AS emp_bonus "
                    // left join to include records even if user doesn't exist in roles table
                    const getUpdatedUserQuery = `SELECT 
                                                        e.emp_id, 
                                                        e.emp_name, 
                                                        COALESCE(NULLIF(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', '), ''), 'None') AS emp_perms, 
                                                        COALESCE(NULLIF(r.role_name, ''), 'Employee') AS role_name, 
                                                        e.emp_abscence, 
                                                        e.emp_rate, 
                                                        e.emp_position, 
                                                        e.emp_email ,
                                                        ${access_salary} 
                                                    FROM 
                                                        employees e 
                                                    LEFT JOIN  
                                                        roles r ON e.emp_id = r.emp_id 
                                                    LEFT JOIN employee_perms ep ON e.emp_id = ep.emp_id 
                                                    LEFT JOIN perms p ON ep.perm_id = p.perm_id
                                                    WHERE 
                                                        e.emp_id = ?
                                                        GROUP BY
                                                        e.emp_id, e.emp_name, r.role_name, e.emp_abscence, e.emp_rate, e.emp_position, e.emp_email, e.emp_salary, e.emp_bonus;`;
                        
            
            
            const UpdateUser = await executeMySqlQuery(getUpdatedUserQuery , [emp_id]);

                    /***************************************************/
                    if(failing_messages.length > 0){
                        // 401 for unauthorized modifications
                        res.status(401).json({ success:false,body:UpdateUser[0], messages : failing_messages})
                    }
                    else{
                        res.status(200).json({ success:true,body:UpdateUser[0], messages : [{success:true ,message:"Successful Updating User"}]})
                    }
        }
        catch (err) {
            consoleLog(`Error In Update Others Api Path ${err} `, "error")
            res.status(500).json({
                success:false,
                message:"Error In Update Others Api Path "
            })
        }
    })


/************************************************************************************************************************/

// Delete Employee Data
router.delete("/delete-employee", jwtVerify, async (req, res) => {
    try {
        const { modifier_email, modifier_id, modifier_name, emp_id, emp_name, emp_email } = req.body;
        

        // all these fields required to delete & send email
        if(!modifier_email || !modifier_id || !emp_id || !emp_email  ) return res.status(400).json({success:false,message:"Bad Request"});
        
        
        let ModifierpermsSet = new perms(await User.getUserperms(modifier_id));
        let isAllFulfilled = false;
        
        if (ModifierpermsSet.isPermExist("Delete User")) {
            const ModifierRole = await User.getUserRole(modifier_id);
            const otherUserRole = await User.getUserRole(emp_id);

            if (ModifierRole === "SuperAdmin") {
                isAllFulfilled = await SuperAdmin.RemoveOtherUser(emp_id , otherUserRole);
            } else if (ModifierRole === "Admin") {
                isAllFulfilled = await Admin.RemoveOtherUser(emp_id , otherUserRole);
            }

            
        }
        else{
            return res.json({success:false , message:"Not Allowed To Delete Users"})
        }
        console.log("isAllFulfilled",isAllFulfilled)
        if (isAllFulfilled) {
            const isSent = await mailer(modifier_email, emp_email, "You Got Accepted", `
                Dear ${emp_name},

                We regret to inform you that, after careful consideration, we have made the decision to terminate your employment with our company, effective ${new Date()}.

                This decision was made in line with company policies and after evaluating recent events and your performance. Please arrange to return any company property in your possession.
                You will receive your final paycheck and any relevant information regarding benefits and severance shortly.
                If you have any questions regarding this process, feel free to contact HR.

                We appreciate your contributions to the company and wish you the best in your future endeavors.

                Sincerely,
                ${modifier_name}
            `);

            if (isSent)
                return res.json({ success: true, message: "User Deleted & Email Sent" });
            else
                return res.status(500).json({ success: false, message: "User Deleted But Email Not Sent" });

        } else {
            return res.status(500).json({ success: false, message: "User Wasn't Deleted" });
        }
    } catch (err) {
        consoleLog(`Error Delete Employee Data ${err}`, "error");
        res.json({
            success: false,
            message: "Error Delete Employee Data"
        });
    }
});






/************************************************************************************************************************/
/********************Registered Page***********************/

router.get("/registered-approve",jwtVerify,async (req,res)=>{
    try{    
            const {modifier_id ,currPage , size , filtered_emp_email} = req.query;



        // Bad Request if
        if(!modifier_id || !currPage || !size   ) return res.status(400 ).json({success:false,message:"Bad Request"});


                
            const ModifierpermsSet = new perms(await User.getUserperms(modifier_id));

            if(!ModifierpermsSet.isPermExist("Accept Registered")){
                return res.json({success:false , message:"You Have No Permission"})
            } 
            

            /* Safe from SQL INJECTION */
            let query = `SELECT * FROM unregistered_employees`;
            const params = [];

            if (filtered_emp_email) {
                query += ` WHERE emp_email = ?`;
                params.unshift(filtered_emp_email); // push filtered_emp_email at first element
            }

            query += ` LIMIT ? OFFSET ?`;
            params.push(parseInt(size), parseInt((currPage - 1) * size)); // Add size and offset as parameters

            const users = await executeMySqlQuery(query, params);



            if( users && users.length > 0){
                res.json({success : true , body:users, message:"Successfully Fetched Waiting List Data"})
              }
              else{
                res.json({success : false  ,  message:"Waiting List Is Empty"})
              }

    }
    catch(err){

        consoleLog(`Error Register Page Employee Data ${err}` ,"error");
        res.json({
            success:false,
            message:"Error Register Page Employee Data"
        })
    }
})


/************************************************************************************************************************/
router.post("/registered-approve/accept",jwtVerify,async (req,res)=>{
    try{    
        const {modifier_id ,modifier_email ,  modifier_name , emp_name ,emp_email } = req.query;


        // Reqired to accept user and send email
        if(!modifier_id || !modifier_email || !emp_email  ) return res.status(400 ).json({success:false,message:"Bad Request"});

        const ModifierpermsSet = new perms(await User.getUserperms(modifier_id));

        

        if(!ModifierpermsSet.isPermExist("Accept Registered")){
            return res.json({success:false , message:"You Have No Permission"})
        }

        const LastIdInTable = await executeMySqlQuery("SELECT emp_id FROM employees ORDER BY emp_id DESC LIMIT 1")

        const accepted_user = await executeMySqlQuery(`SELECT * FROM unregistered_employees WHERE emp_email = ?`,[emp_email]);
        
        // before getting keys and values of user we have to remove old id
        delete accepted_user[0].emp_id;


        // get seperate keys and values
        const { columns_field , values_field} = stringifyFields("seperate",Object.entries(accepted_user[0]));
        


        // insert with default values and increment id by 1
        const addToEmployeeTable = await executeMySqlQuery(`INSERT INTO employees (emp_id , ${columns_field} , emp_salary , emp_bonus , emp_abscence , emp_rate) VALUES (${LastIdInTable[0].emp_id + 1},${values_field} , 0 , 0 , 0 , 0)`);


        // delete from registered table after making sure he was added
        await executeMySqlQuery(`DELETE FROM unregistered_employees WHERE emp_email = ?`,[emp_email])


        

        if(addToEmployeeTable){
            const isSent =await mailer(modifier_email ,emp_email, "You Got Accepted" , `
                Dear ${emp_name},
    
                We are excited to inform you that you have been officially accepted as a part of the  team! We were impressed with your skills and qualifications, and we are confident you will make valuable contributions.
    
                Our HR team will reach out to you soon with further details regarding your onboarding process. Should you have any questions in the meantime, feel free to reach out.
    
                Once again, congratulations, and we look forward to welcoming you aboard!
    
                Best regards,
                ${modifier_name}
            
            `);
            if(isSent)
                return res.json({success:true , message:"User Got Accepted & Email Sent"});
            else
            return res.json({success:false , message:"User Got Accepted But Email Not Sent"});
        }else{
            return res.json({success:false , message:"Failed To Accept User"})
        }

        
             
    }
    catch(err){
        consoleLog(`Error Register Page Accept Employee Data ${err}` ,"error");
        console.log(err)
        res.json({
            success:false,
            message:"Error Register Page Accept Employee Data"
        })
    }
})

/************************************************************************************************************************/
router.delete("/registered-approve/decline",jwtVerify,async (req,res)=>{
    try{    
        const {modifier_id , modifier_email , modifier_name , emp_email : declined_user_email , emp_name} = req.query;

        
        // Reqired to decline user and send email
        if(!modifier_id || !modifier_email || !declined_user_email   ) return res.status(400).json({success:false,message:"Bad Request"});
        
        
        const ModifierpermsSet = new perms(await User.getUserperms(modifier_id));

        if(!ModifierpermsSet.isPermExist("Accept Registered")){
            return res.json({success:false , message:"You Have No Permission"})
        }

        // delete from registered table after making sure he was added
        const deleteFromRigesterTable = await executeMySqlQuery(`DELETE FROM unregistered_employees WHERE emp_email = ?`,[declined_user_email])


        if(deleteFromRigesterTable){
            const isSent =await mailer(modifier_email ,declined_user_email, "You Got Accepted" , `
                Dear ${emp_name},
    
                Thank you for taking the time to apply for the position at Our Company. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.

                We truly appreciate your interest in joining our team and encourage you to apply for future opportunities that may align with your skills and experience.

                We wish you the best in your future endeavors.
    
                Best regards,
                ${modifier_name}
            
            `);
            if(isSent)
                return res.json({success:true , message:"User Got Rejected & Email Sent"});
            else
            return res.json({success:false , message:"User Got Rejected But Email Not Sent"});
        }else{
            return res.json({success:false , message:"Failed To Delete User"})
        }

        
             
    }
    catch(err){
        console.error(`Error Register Page Delete Employee Data:`, err);
        res.json({
            success:false,
            message:"Error Register Page Delete Employee Data"
        })
    }
})


module.exports = router;


