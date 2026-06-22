const executeMySqlQuery = require("../../Utils/executeMySqlQuery");
const stringifyFields = require("../../Utils/stringifyFields");
const sqlTransaction = require("../../Utils/sqlTransaction");
const CompanyUsersMethods = require("../CompanyUsers/CompanyUsersMethods");
class perms {

    static async getAllpermsInTable(){
            const query = "SELECT * FROM perms";
            // declare as let to use map and edit elements
            const permsObjects =  await executeMySqlQuery(query);
            let perms2DArray = [];
            permsObjects.forEach((perm)=> perms2DArray.push([perm.perm_name , perm.perm_id]));
            return new Map(perms2DArray); // return hashing of all perms with it's id 
       }
     
     isPermExist(perm){
        return this.perms.has(perm)
    }

    static async executeChangeOtherUserData(other_user_id, other_user_title, updatingObj){
        return await CompanyUsersMethods.MapUserToFullUpdateFunction(other_user_id, other_user_title, updatingObj)
    }


    static async executeChangeOtherPerms(emp_id , newpermsSet , oldUserpermsSet){
        
        const permsHash =  await perms.getAllpermsInTable(); // fetch map hash of perms and their ids
        const ArrayOfNewPerms = newpermsSet ? Array.from(newpermsSet) : []
        const StringOfNewperms = ArrayOfNewPerms.length > 0 ? ArrayOfNewPerms.join(", ") : "None"

        /******************* Stage 1 = Delete All Old Perms *******************/
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
                const deleteQuery = `DELETE FROM  employee_perms WHERE emp_id = ? AND perm_id IN ( ${deletepermsIDS.join(",")} )` 
                await executeMySqlQuery(deleteQuery,[emp_id]);
            }
            
        }

        /******************* Stage 2 = Check If No New Perms To Be Added Stop Execution *******************/
        if(StringOfNewperms === "None") return; 
        
        /******************* Stage 3 = Add All New Perms *******************/
        let addingpermsQuery = [];
        // if perm wasn't exist in old perms and exists in all hashed perms then insert it 
        StringOfNewperms.split(", ").forEach((perm)=>{
            if(permsHash.has(perm) && !oldUserpermsSet.has(perm))
                addingpermsQuery.push(`(${emp_id},${permsHash.get(perm)})`); // to get perm id
        })

        if(addingpermsQuery.length > 0)
            await executeMySqlQuery("INSERT INTO employee_perms (emp_id , perm_id) VALUES" + addingpermsQuery.join(",") ,"Error Updating User perms");
    }

    // need other_user_Role as parameter 
    static async executeChangeOtherRole(emp_id , other_user_Role , other_user_new_role ){
                    /*
                        (condition 1): If user was NormalUser && new role is differnt, this means user wasn't in roles table
                        (condition 2): If user was having another role then it was added and we just update
                        (condition 3): If user was having another role and new role is NormalUser then it has to be deleted so (condition 1) stays valid, and free up space
                    */

                        if(other_user_Role === "NormalUser" && other_user_new_role !== "NormalUser"){
                            const query = `INSERT INTO roles (emp_id  , role_name) VALUES (?,?)`
                            await executeMySqlQuery(query ,[emp_id  , other_user_new_role]);
                        }
                        else if(other_user_Role !== "NormalUser" && other_user_new_role !== "NormalUser"){
                            const query = `UPDATE roles SET role_name = ? WHERE emp_id = ?`
                            await executeMySqlQuery(query ,[ other_user_new_role , emp_id]);
                        }
                        else{
                            const query = `DELETE FROM roles  WHERE emp_id = ?`
                            await executeMySqlQuery(query ,[emp_id]);
                        }
    }

    static async executeRemoveOtherUser(emp_id){
        // To create Transaction & Rollback on errors
        const queries = [ `DELETE FROM users WHERE user_id = ${emp_id}`]
            return await sqlTransaction(queries);
        
    }

}


module.exports =  perms // export an instance
