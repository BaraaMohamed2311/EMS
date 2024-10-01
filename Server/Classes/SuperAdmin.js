const User = require("./User");
const executeMySqlQuery = require("../Utils/executeMySqlQuery");
const stringifyFields = require("../Utils/stringifyFields");
const roles = require("./roles");
const perms = require("./perms");

/*

SuperAdmin should be able to do
- change role of other users
- see salary and edit it for other users
- edit or remove employees data

*/
class SuperAdmin extends User {
    static priority = 100;// we are going to use priority to check that user is editing people with lower or equal priority
    constructor({emp_id,emp_email,emp_name,emp_role , emp_salary , emp_abscence , emp_bonus , emp_rate , emp_position , emp_password}){
        super(emp_id,emp_email,emp_name,emp_role , emp_salary , emp_abscence , emp_bonus , emp_rate , emp_position , emp_password);
        
    }

    getPriority(){
        return this.priority
    }


    
    // this updates role_name field in roles table
    static async ChangeOtherUserRole( emp_id , otherUserRole , newRole , otherUserEmail){
        return new Promise(async (resolve , reject )=>{
            try{
                
            // compares user modifier priority with other user's 
                if( this.priority >= roles.getRolePriority(otherUserRole)){
                    /*
                        if Role was Employee and new Role is not then we add user with new Role
                        if both not Employee we only need to update

                    */
                    if(otherUserRole === "Employee" && newRole !== "Employee"){
                        const query = `INSERT INTO roles (emp_id , emp_email , role_name) VALUES (${emp_id},'${otherUserEmail}','${newRole}')`
                        await executeMySqlQuery(query ,"Error Updating User Role");
                    }
                    else if(otherUserRole !== "Employee" && newRole !== "Employee"){
                        const query = `UPDATE roles SET role_name = '${newRole}' WHERE emp_id = ${emp_id}`
                        await executeMySqlQuery(query ,"Error Updating User Role");
                    }
                    else{
                        const query = `DELETE FROM roles  WHERE emp_id = ${emp_id}`
                        await executeMySqlQuery(query ,"Error Updating User Role");
                    }
                    
                
                    resolve(true);
                }
            else{

                resolve(false);
            }
        } catch(err){
            console.error(err)
            reject(err)
        }
        })
    }

    
    // this updates emp_perms field in perms table
    static async ChangeOtherUserperms(emp_id , otherUserRole , StringOfNewperms , oldUserpermsSet){
        

        return new Promise(async (resolve , reject )=>{
            try{
                
                if( this.priority >= roles.getRolePriority(otherUserRole)){
                    // fetch map hash of perms and their ids
                    const permsHash =  await perms.getAllpermsInTable();

                    const newpermsArray = StringOfNewperms.split(", ");
                    const newpermsSet = new Set(newpermsArray);

                    // if user had old perms we delete those deleted 
                    if(!oldUserpermsSet.has("None")){
                        let deletepermsIDS = [];

                        // only add id of perm to be deleted if it's not in old perms
                        Array.from(oldUserpermsSet).forEach((oldPerm , indx)=>{
                            if(!newpermsSet.has(oldPerm)){
                                deletepermsIDS.push(` ${permsHash.get(oldPerm)}  `);
                            }
                        })
                        
                        // if there is perms to delete execute query
                        if(deletepermsIDS.length > 0){
                            // First we delete all perms related with user
                            const deleteQuery = `DELETE FROM  employee_perms WHERE emp_id = ${emp_id} AND perm_id IN ( ${deletepermsIDS.join(",")} )` 

                            await executeMySqlQuery(deleteQuery,"Error Deleting User perms");
                        }
                        
                    }

                    // no new perms will be added to user
                    if(StringOfNewperms === "None") return resolve(true); 
                    
                    
                    let addingpermsQuery = [];
                    

                    // if perm wasn't exist in old perms and exists in all hashed perms then insert it 
                    StringOfNewperms.split(", ").forEach((perm)=>{
                        if(permsHash.has(perm) && !oldUserpermsSet.has(perm))
                            addingpermsQuery.push(`(${emp_id},${permsHash.get(perm)})`); // to get perm id
                    })

                    if(addingpermsQuery.length > 0)
                     await executeMySqlQuery("INSERT INTO employee_perms (emp_id , perm_id) VALUES" + addingpermsQuery.join(",") ,"Error Updating User perms");
                
                resolve(true);
            }
            else{

                resolve(false);
            }
        } catch(err){
            console.error(err)
            reject(err)
        }
        })
    }


    // this updates any data field in employees table
    static async EditOtherUser(emp_id , otherUserRole , entries){
        
        return new Promise(async (resolve , reject )=>{
            try{
                
            if( this.priority >= roles.getRolePriority(otherUserRole)){
                
                const fields = stringifyFields("joined",entries);

                const query = `UPDATE employees SET ${fields} WHERE emp_id = ${emp_id}`
                await executeMySqlQuery(query ,"Error Updating Other User  Data" , "Success Updating Other User Data");
                
                resolve(true);
            }
            else{
                resolve(false);
            }
        } catch(err){
            console.error(err)
            reject(err)
        }
        })
    }

    static async RemoveOtherUser(emp_id){

        // remove user data & refrenced role & perms ** note removing from employees should be the last due to keys refrenced from it at employee_perms & roles
        const queries = [ `DELETE FROM employee_perms WHERE emp_id = ${emp_id}` , `DELETE FROM roles WHERE emp_id = ${emp_id}` , `DELETE FROM employees WHERE emp_id = ${emp_id}` ]
        const removeOtherUserPromises = [];
        queries.forEach((query)=>{
            const promise = new Promise(async (resolve , reject)=>{
                try{
                    const result = await executeMySqlQuery(query ,"Error Updating User Role" , "Success Updating Role");
                    resolve(result);
                }
                catch(err){
                    reject(err);
                }
            })

            removeOtherUserPromises.push(promise);
            
        })
        const settled = await Promise.allSettled(removeOtherUserPromises);
        
        // to return true if all promises fulfilled
        return settled.filter((status)=> status !== "rejected").length === queries.length
        
        
        
    }
}

module.exports = SuperAdmin;