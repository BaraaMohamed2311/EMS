
/*Any user can get his data or modify it */
const connectionPool = require("../Utils/connect_ems_db");
const stringifyFields = require("../Utils/stringifyFields");
const executeMySqlQuery = require("../Utils/executeMySqlQuery");
const bcrypt = require("bcrypt")
class User {
    // extracting fields
    constructor({emp_id,emp_email,emp_name,emp_role , emp_salary , emp_abscence , emp_bonus , emp_rate , emp_position , emp_password}){
        this.emp_id = emp_id
        this.emp_email = emp_email ;
        this.emp_name = emp_name ;
        this.emp_salary = emp_salary  ;
        this.emp_abscence = emp_abscence ;
        this.emp_bonus = emp_bonus ;
        this.emp_rate = emp_rate ;
        this.emp_position = emp_position ;
        this.emp_password = emp_password ;
     
        }


    static async editUserData(emp_id ,entries){
        // to get convert entries into field = val , field = val
        const fields = stringifyFields("joined",entries);
        // update data query
        const query = `UPDATE employees SET ${fields} WHERE emp_id = ${emp_id};`
        // update in db
        await executeMySqlQuery(query , "Error editUserData Method")

    }

    static async getUserRole(emp_id=null , err_msg , emp_email=null ){
        //Finds Role of user using id or email & by default Role is Employee if not defined or user not exist
        const query = `SELECT COALESCE( (SELECT NULLIF(r.role_name, '') FROM roles r WHERE ${emp_id ? `emp_id = ${emp_id}` :`emp_email = '${emp_email}'`} ),'Employee') AS role_name;
`
            // [0] as result is in array form but Role field has a  single value as string 
            const result = await executeMySqlQuery(query , err_msg);
            return result[0].role_name ; 
     
    }

    static async getUserperms(emp_id , err_msg ){
        //COALESCE(NULLIF()) to replace empty string and null with None by default
        const query = `SELECT p.perm_name FROM perms p JOIN employee_perms ep ON p.perm_id = ep.perm_id WHERE ep.emp_id = ${emp_id} `
        // [0] as result is in array form but perms field has a single value as string 
        const result = await executeMySqlQuery(query , err_msg);
            return result.length > 0 ? result.map((perm)=> perm.perm_name) : ["None"] ;  
        
    }

    static async hashPassword(password){
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    extractUserfields(keysToBeExtracted){
        // to extract fields like emp_password & emp_salary if needed
        //this will be for privacy when returning res to client side only , so no need to change anything in db
        for(const key of keysToBeExtracted){
            this[key] = null; // set them to null
        }
    }


    

}


module.exports = User;