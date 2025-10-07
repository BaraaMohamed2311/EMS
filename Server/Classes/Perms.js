const executeMySqlQuery = require("../Utils/executeMySqlQuery");
const stringifyFields = require("../Utils/stringifyFields");
const sqlTransaction = require("../Utils/sqlTransaction");
class perms {
    // because no need to create instances we make them static and access through class
     
    /* 
       "AR" => Accept Registered User
       "MD" => Modify Data Users
       "MR" => Modify Role
       "MP" => Modify Perms
       "MS" => Modify Salary
       */

       constructor(arrayOfperms){
        this.perms = new Set(arrayOfperms);
       }

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

    static async executeEditOthers(emp_id  , entries){
        
        const fields = stringifyFields("joined",entries);
        const query = `UPDATE employees SET ${fields} WHERE emp_id = ?`
        await executeMySqlQuery(query ,[emp_id]);

    }


    static async executeChangeOtherPerms(emp_id , StringOfNewperms , oldUserpermsSet){
        
        const permsHash =  await perms.getAllpermsInTable(); // fetch map hash of perms and their ids
        const newpermsArray = StringOfNewperms.split(", ");
        const newpermsSet = new Set(newpermsArray);

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

    // need otherUserRole as parameter
    static async executeChangeOtherRole(emp_id , otherUserRole , newRole , otherUserEmail){
                    /*
                        if Role was Employee (which means user is not in roles table) and new Role is not, then we add user with new Role
                        if both not Employee we only need to update
                    */
                        if(otherUserRole === "Employee" && newRole !== "Employee"){
                            const query = `INSERT INTO roles (emp_id , emp_email , role_name) VALUES (?,?,?)`
                            await executeMySqlQuery(query ,[emp_id , otherUserEmail , newRole]);
                        }
                        else if(otherUserRole !== "Employee" && newRole !== "Employee"){
                            const query = `UPDATE roles SET role_name = ? WHERE emp_id = ?`
                            await executeMySqlQuery(query ,[ newRole , emp_id]);
                        }
                        else{
                            const query = `DELETE FROM roles  WHERE emp_id = ?`
                            await executeMySqlQuery(query ,[emp_id]);
                        }
    }

    static async executeRemoveOtherPerm(queries){
        // To create Transaction & Rollback on errors

            return await sqlTransaction(queries);
        
    }

}


module.exports =  perms // export an instance
