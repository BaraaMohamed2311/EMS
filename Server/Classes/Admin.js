const User = require("./User");
const roles = require("./roles");
const perms = require("./perms");
const consoleLog = require("../Utils/consoleLog");
/*
Admin should be able to do
*/
class Admin extends User {
    static priority = 50; 

    
    getPriority(){
        return this.priority
    }
    // other user must be admin or less role, cannot be superAdmin
    static  EditOtherUser(emp_id , otherUserRole , entries){
    
        return new Promise(async (resolve , reject )=>{
            try{
               
            if( this.priority >= roles.getRolePriority(otherUserRole)){

                await perms.executeEditOthers(emp_id  , entries)
                resolve(true);
            }
            else{
                consoleLog("Admins Cannot Edit Users With Higher Role" , "error");
                resolve(false);
            }
        } catch(err){
            console.error(err)
            reject(err)
        }
        })
       
        
    }
    // other user must be admin or less role, cannot be superAdmin
    async RemoveOtherUser(emp_id , otherUserRole){
        if( this.priority >= roles.getRolePriority(otherUserRole)){

             /*
            This order ensures correct deletion to avoid deleting row with refrenced key error
            ----------------------------------------------------------------------------------
            Step 1 remove user from employee_perms
            Step 2 remove user from roles
            Step 3 remove user from employees
            */

            // this is a quick check of emp_id is number to prevent sql injection
            if(isNaN(Number(emp_id))) return;

            const queries = [ `DELETE FROM employee_perms WHERE emp_id = ${emp_id}` , `DELETE FROM roles WHERE emp_id = ${emp_id}` , `DELETE FROM employees WHERE emp_id = ${emp_id}` ]

            return await perms.executeRemoveOtherPerm(queries);

        }
        else{
            return false
        }
    }
}


module.exports = Admin;