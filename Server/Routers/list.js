const router = require("express").Router();
const NodeCache = require("node-cache");
const jwtVerify = require("../middlewares/jwtVerify.js");
const User = require("../Classes/User.js");
const perms = require("../Classes/Perms/perms.js");
const SuperAdmin = require("../Classes/Roles/SuperAdmin.js");
const Admin = require("../Classes/Roles/Admin.js");
const stringifyFields = require("../Utils/stringifyFields.js");
const executeMySqlQuery = require("../Utils/executeMySqlQuery.js");
const JoinFiltering = require("../Utils/JoinFiltering.js");
const consoleLog = require("../Utils/consoleLog.js");
const mailer = require("../Utils/mailer.js")
const  ModifyOtherUserData  = require("../Utils/ControlUsers/ModifyOtherUserData.js");
const  ModifyOtherUserRole  = require("../Utils/ControlUsers/ModifyOtherUserRole.js");  
const  ModifyOtherUserPerms = require("../Utils/ControlUsers/ModifyOtherUserPerms.js");
const sqlTransaction = require("../Utils/sqlTransaction.js");
const cacheCountNodeCache = require("../Utils/cacheCountNodeCache.js");
const padBoth = require("../Utils/padBoth.js");
const buildJoinedFilters = require("../Utils/buildJoinedFilters.js");
const CompanyUsersMethods = require("../Classes/CompanyUsers/CompanyUsersMethods.js");
const {setOfPerms , hospitalJobs} = require("../Tables/data.js");
const AuditLogs = require("../Utils/methods/AuditLogs.js");
const { excludeFields , EXCLUDE_UPDATE_FIELDS} = require("../Tables/pick_exc_fields.js");

// GET Employees Data
router.get("/employees",jwtVerify,async (req,res)=>{
    try{
        const { pagination, size , user_id,isFiltered, role_name: filter_role_name, emp_perms: filter_emp_perm, ...restFilters } = req.query; 
        
        //Bad Request if modifier id or others doesn't exist
        if(!pagination || !size || !user_id ) return res.status(400).json({success:false,message:"Bad Request"});

        // Ceck if list page can be accessible
        const Modifier_role = await User.getUserRole(user_id);
        const Modifier_perms = await User.getSetUserperms(user_id);
        // perms have there separate filtiring conditing using "HAVING" not "WHERE"
        // we use custom condition to handle NormalUser role because it's named NormalUser not Employee in roles table and also it can be null because normal users have no role record in roles table
        const role_filtering_string = filter_role_name === "NormalUser" ? "(r.role_name IS NULL OR r.role_name = 'NormalUser')" : filter_role_name
                                        ? `r.role_name = '${filter_role_name}'` : null;

        const rest_filtering_string = Object.keys(restFilters || {}).length > 0 ? padBoth(buildJoinedFilters({ ...restFilters }), 1) : null;

        const filtering_string = [rest_filtering_string, role_filtering_string].filter(Boolean).join(" AND ");
        
        if (Modifier_role === "NormalUser") return res.status(403).json({ success: false, message: "NormalUser Role cannot access The list" });


        // get cached count 
        const EmployeesCount = await cacheCountNodeCache("totalNumOfEmployees",CompanyUsersMethods.getAllCompanyEmployeesCOUNT,filtering_string)
        const numOfPages = Math.max(1, Math.ceil( EmployeesCount / size));

        const users = await CompanyUsersMethods.getAllCompanyEmployeesFullData(parseInt(size), parseInt((pagination - 1) * size ),filtering_string,filter_emp_perm);

        const filteredUsers = users?.map(user => {
            // Check if user has the required permission
            const canDisplaySalary = Modifier_perms?.has("Display Salary");

            if (!canDisplaySalary) {
                // Create a shallow copy without emp_salary and emp_bonus
                const { emp_salary, emp_bonus, ...rest } = user;
                return rest;
            }

            return user; // keep as-is if permission exists
        });

        

      if( users && users.length > 0){
        res.status(200).json({success : true , body:filteredUsers, message:"Successfully Fetched Data",numOfPages: numOfPages})
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

    router.put("/other/employee",jwtVerify ,async function(req , res){
        try {   
                // ===1. Get Data From Body & Query of actions to be made
                    let { modifier_id ,modifier_email,   other_user_email , other_user_new_role ,  other_user_new_perms ,   ...newEmployeeData} = req.body;
                    let {perms_requested} = req.query;
                    const permsRequestedSet= perms_requested ? new Set(perms_requested.split("-")) : null;

                    let failing_messages = [];



                // ===3. Check Bad Request
                if(!permsRequestedSet || !modifier_id || !other_user_email || !modifier_email) 
                    return res.status(400).json({success:false,messages:[{success:false,message:"Bad Request"}]});
                
                // ===4. Check Neither Modifer or Other user are patients

                const ModifierUserType = await User.getUserTypeByEmail(modifier_email);
                const OtherUserType = await User.getUserTypeByEmail(other_user_email);

                if(ModifierUserType === 'patient')  return res.status(403).json({success:false,messages:[{success:false,message:"You Are A Patient Not An Employee"}]});
                if(OtherUserType === 'patient')  return res.status(403).json({success:false,messages:[{success:false,message:"That User Is A Patient Not An Employee"}]});
                // Get fresh title and id from db
                const other_user_id = await User.getUserIDByEmail(other_user_email)
                const other_user_title = await User.getUserTitleByID(other_user_id);


                // Check that all requested perms are valid
                    const isValidPerms =  [...permsRequestedSet].every(x => setOfPerms.has(x));
                    if(!isValidPerms)
                    return res.status(403).json({success:false,message:"No valid permission requested "});

                    // ===5. Get Required Roles and Permissions for execution

                    // then modifier is different user 
                    const modifierRole = await User.getUserRole(modifier_id);
                    const  modifierSetperms = await User.getSetUserperms(modifier_id);
                    const other_user_Role = await User.getUserRole(other_user_id );
                    
                    // check if user is authorized to modify salarry
                    const is_authorized_modify_salary = modifierSetperms.has("Modify Salary");
                    const excuded_fields = is_authorized_modify_salary ? EXCLUDE_UPDATE_FIELDS : [...EXCLUDE_UPDATE_FIELDS,"emp_salary","emp_bonus","initial_consultation_price","surgery_price","followup_consultation_price"];
                    const safeData = excludeFields( newEmployeeData ,excuded_fields)
                    
                    //===6. Check if modifier have perm to update other users data & action is requested
                    if(permsRequestedSet.has("Modify Employee Data")){
                        if(modifierSetperms.has("Modify Employee Data")){
                            await ModifyOtherUserData(other_user_id, other_user_Role,other_user_title, modifierRole, safeData, other_user_email ,failing_messages)
                        }
                        else{ 
                            failing_messages.push({success:false , message: "Not Allowed To Modify User Data"})
                        }
                    }
                    
                    //===7. Check if modifier have perm to update other users role & action is requested
                    if(permsRequestedSet.has("Modify Employee Role")){
                        if (modifierSetperms.has("Modify Employee Role")){

                            await ModifyOtherUserRole(modifierRole, other_user_id, other_user_Role, other_user_new_role, other_user_email,failing_messages)
                        }
                        else{
                            failing_messages.push({success:false , message: "Not Allowed To Modify User Role"})
                        }
                    }
                    //===8. Check if modifier have perm to update other users perms & action is requested
                    if(permsRequestedSet.has("Modify Employee Perms")){
                        if (modifierSetperms.has("Modify Employee Perms")){
                            const oldUserpermsSet = await User.getSetUserperms(other_user_id)
                            const newpermsSet = other_user_new_perms ? new Set(other_user_new_perms.split(", ")) : new Set()
                            await ModifyOtherUserPerms(other_user_id, other_user_Role, modifierRole, newpermsSet,oldUserpermsSet,failing_messages)
                        }
                        else{
                            failing_messages.push({success:false , message: "Not Allowed To Modify User Permissions"})
                        }
                    }

                    await AuditLogs.addLog(
                        "EMS",                             // site_id
                        modifier_id,                             // who made the change
                        failing_messages.length > 0
                            ? "Failed Update Employee Data"
                            : "Successful Update Employee Data", // method/action
                        {                                       // affects_who
                            email: other_user_email,
                            status: failing_messages.length > 0 ? "failure" : "info"
                        }
                    );



                    //===10. Send any failing messages or success
                    if(failing_messages.length > 0){
                        return res.status(409).json({ success:false, messages : failing_messages})
                    }
                    else{
                        return res.status(200).json({ success:true, messages : [{success:true ,message:"Successful Updating User"}]})
                    }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                success:false,
                message: err.message || "Error In Update Others Api Path "
            })
        }
    })


/************************************************************************************************************************/

// Delete Employee Data
router.delete("/other/employee", jwtVerify, async (req, res) => {
    try {
        const { modifier_email, modifier_id, modifier_name, other_user_name, other_user_email } = req.query;
        

        // all these fields required to delete & send email
        if(!modifier_email || !modifier_id || !other_user_email  ) return res.status(400).json({success:false,message:"Bad Request"});
        
        
        let ModifierpermsSet = await User.getSetUserperms(modifier_id);
        const other_user_id = await User.getUserIDByEmail(other_user_email);
        let isAllFulfilled = false;
        
        if (!ModifierpermsSet.has("Delete User"))  return res.json({success:false , message:"Permission is required to Delete User"});

            const ModifierRole = await User.getUserRole(modifier_id);
            const otherUserRole = await User.getUserRole(other_user_id);

            if (ModifierRole === "SuperAdmin") {
                isAllFulfilled = await SuperAdmin.RemoveOtherUser(other_user_id , otherUserRole);
            } else if (ModifierRole === "Admin") {
                isAllFulfilled = await Admin.RemoveOtherUser(other_user_id , otherUserRole);
            }

            
            await AuditLogs.addLog(
                "EMS",                             // site_id
                modifier_id,                             // who made the change
                isAllFulfilled
                    ? "Successful Delete Employee"
                    : "Failed Delete Employee", // method/action
                {                                       // affects_who
                    email: other_user_email,
                    status: isAllFulfilled ? "info" : "failure"
                }
            );
        
        if (isAllFulfilled) {
            const isSent = await mailer(modifier_email, other_user_email, "You Got Accepted", `
                Dear ${other_user_name},

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
                return res.status(502).json({ success: false, message: "User Deleted But Email Not Sent" });

        } else {
            return res.status(409).json({ success: false, message: "User Wasn't Deleted" });
        }
    } catch (err) {
        consoleLog(`Error Delete Employee Data ${err}`, "error");
        res.json({
            success: false,
            message: "Error Delete Employee Data"
        });
    }
});






/*****************************************************************************************************/
/********************Registered Page***********************/

router.get("/registered-approve",jwtVerify,async (req,res)=>{
    try{    
            const {modifier_id ,currPage , size , ...restFilters} = req.query;



        // Bad Request if
        if(!modifier_id || !currPage || !size   ) return res.status(400 ).json({success:false,message:"Bad Request"});

            const Modifier_role = await User.getUserRole(modifier_id);
            if (Modifier_role === "NormalUser") return res.status(403).json({ success: false, message: "NormalUser Role cannot access The list" });

            // perms have there separate filtiring conditing using "HAVING" not "WHERE"
            const filtering_string = Object.keys(restFilters).length > 0 ? padBoth(JoinFiltering(Object.entries({  user_email:restFilters.user_email , user_name:restFilters.user_name})),1) :null; ;

            const ModifierpermsSet = await User.getSetUserperms(modifier_id);

            if(!ModifierpermsSet.has("Accept Registered")){
                return res.json({success:false , message:"You Have No Permission"})
            } 
            

            /* Safe from SQL INJECTION */
            let query = `SELECT * FROM unregistered_employees`;

            if (filtering_string) {
                query += ` WHERE ${filtering_string} `;
            }
            const limit = parseInt(size), offset = parseInt((currPage - 1) * size);
            query += ` LIMIT ${limit} OFFSET ${offset}`;


            const users = await executeMySqlQuery(query);



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
        const {modifier_id ,modifier_email ,  modifier_name  ,user_email , user_name  } = req.query;


        // Reqired to accept user and send email
        if(!modifier_id || !modifier_email || !user_email  ) return res.status(400 ).json({success:false,message:"Bad Request"});

        const ModifierpermsSet = await User.getSetUserperms(modifier_id);

        

        if(!ModifierpermsSet.has("Accept Registered")){
            return res.json({success:false , message:"You Have No Permission"})
        }
        // Fetch user data from registered table
        const registering_user_data = await executeMySqlQuery(`SELECT * FROM unregistered_employees WHERE user_email = ? LIMIT 1`,[user_email]);

        if(!registering_user_data || registering_user_data.length === 0){
            return res.json({success:false , message:"User Not Found In Registered Table"})
        }
        // get last user id to increment it by 1
        // MAX() is more effiecient than ORDER BY DESC LIMIT 1
        const LastIdInTable = await executeMySqlQuery("SELECT MAX(user_id) AS user_id FROM users");

        const registering_user_id = LastIdInTable[0].user_id + 1;

        const { user_password , emp_title , emp_specialty } = registering_user_data[0];

        
        const queries = []
        // INSERT TO USERS , EMPLOYEES , EMPLOYEES_HOSPITAL TABLES
        // INSERT TO USERS TABLE
        const intsertToUsers_query = `INSERT INTO users (user_id , user_email, user_name , user_password,user_type) VALUES (${registering_user_id},"${user_email}","${user_name}","${user_password}",'employee')`
        queries.push(intsertToUsers_query);
        // INSERT TO EMPLOYEES TABLE
        const insertToEmployees_query = `INSERT INTO employees (emp_id ,emp_title,emp_specialty, emp_salary , emp_bonus , emp_abscence , emp_rate) VALUES (${registering_user_id},"${emp_title}","${emp_specialty}",0, 0 , 0 , 0 )`
        queries.push(insertToEmployees_query);
        
        // INSERT TO EMPLOYEES_HOSPITAL TABLE ONLY IF USER TITLE IS HOSPITAL JOB
        const insertToHospitalEmps_query = `INSERT INTO employees_hospital (hosp_emp_id,emp_id,emp_title) VALUES (${registering_user_id},${registering_user_id},"${emp_title}");`;
        if(hospitalJobs.has(emp_title)){
            queries.push(insertToHospitalEmps_query);
        }
        // DELETE FROM REGISTERED TABLE
        const deleteOnRegister_query =`DELETE FROM unregistered_employees WHERE user_email = "${user_email}"`
        queries.push(deleteOnRegister_query);


        const addToTables =  await sqlTransaction(queries);
        //=== Add Audit Log
        await AuditLogs.addLog(
            "EMS",                             // site_id
            modifier_id,                             // who made the change
            addToTables
                ? "Successful Accept Registered Employee"
                : "Failed Accept Registered Employee", // method/action
            {                                       // affects_who
                email: user_email,
                status: addToTables ? "info" : "failure"
            }
        );
        

        if(addToTables){
            const isSent =await mailer(modifier_email ,user_email, "You Got Accepted" , `
                Dear ${user_name},
    
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
        const {modifier_id , modifier_email , modifier_name , user_email : declined_user_email , user_name} = req.query;

        
        // Reqired to decline user and send email
        if(!modifier_id || !modifier_email || !declined_user_email   ) return res.status(400).json({success:false,message:"Bad Request"});
        
        
        const ModifierpermsSet = await User.getSetUserperms(modifier_id);

        if(!ModifierpermsSet.has("Accept Registered")){
            return res.json({success:false , message:"You Have No Permission"})
        }

        // delete from registered table after making sure he was added
        const deleteFromRigesterTable = await executeMySqlQuery(`DELETE FROM unregistered_employees WHERE user_email = ?`,[declined_user_email]);

        //=== Add Audit Log
        await AuditLogs.addLog(
            "EMS",                             // site_id
            modifier_id,                             // who made the change 
            deleteFromRigesterTable.affectedRows > 0
                ? "Successful Decline Registered Employee"
                : "Failed Decline Registered Employee", // method/action
            {                                       // affects_who  
                email: declined_user_email,
                status: deleteFromRigesterTable.affectedRows > 0 ? "info" : "failure"
            }
        );


        if(deleteFromRigesterTable){
            const isSent =await mailer(modifier_email ,declined_user_email, "You Got Accepted" , `
                Dear ${user_name},
    
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


