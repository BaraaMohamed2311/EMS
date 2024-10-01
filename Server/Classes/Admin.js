const User = require("./User");
const executeMySqlQuery = require("../Utils/executeMySqlQuery");
const stringifyFields = require("../Utils/stringifyFields");
const roles = require("./roles");
const consoleLog = require("../Utils/consoleLog");
/*

Admin should be able to do


*/
class Admin extends User {
    static priority = 50; // we are going to use priority to check that user is editing people with lower or equal priority
    constructor(emp_email,role){
        super(emp_email,role);
        
    }
    getPriority(){
        return this.priority
    }
    // other user must be admin or less role, cannot be superAdmin
    static  EditOtherUser(emp_id , otherUserRole , entries){
    
        return new Promise(async (resolve , reject )=>{
            try{
               
            if( this.priority >= roles.getRolePriority(otherUserRole)){
                const fields = stringifyFields("joined",entries);
                const query = `UPDATE employees SET ${fields} WHERE emp_id = ${emp_id}`
                await executeMySqlQuery(query ,"Error Updating User Role");

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
    async RemoveOtherUser(emp_id){
        if( this.priority >= roles.getRolePriority(otherUserRole)){

        // remove user data & refrenced role & perms
        const queries = [`DELETE FROM employee_perms WHERE emp_id = ${emp_id}` , `DELETE FROM roles WHERE emp_id = ${emp_id}` , `DELETE FROM employees WHERE emp_id = ${emp_id}` ]
        const removeOtherUserPromises = [];
        queries.forEach((query)=>{
            const promise = new Promise(async (resolve , reject)=>{
                try{
                    const result = await executeMySqlQuery(query ,"Error Updating User Role" );
                    resolve(result);
                }
                catch(err){
                    reject(err);
                }
            })

            removeOtherUserPromises.push(promise);
            
        })

        settled =await Promise.allSettled(removeOtherUserPromises);
        // to return true if all promises fulfilled
        return settled.filter((status)=> status !== "rejected").length === queries.length;

        }
        else{
            return false
        }
    }
}


module.exports = Admin;