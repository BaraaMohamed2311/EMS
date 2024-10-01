const executeMySqlQuery = require("../Utils/executeMySqlQuery");

class perms {
    // because no need to create instances we make them static and access through class
     
    /* 
       "AR" => Accept Registered User
       "MD" => Modify Data Users
       "MR" => Modify Role
       "MP" => Modify perms
       "MS" => Modify Salary
       */

       constructor(arrayOfperms){
        this.perms = new Set(arrayOfperms);
       }

       static async getAllpermsInTable(){
            const query = "SELECT * FROM perms";
            // declare as let to use map and edit elements
            const permsObjects =  await executeMySqlQuery(query , "Error Getting All perms From Table");
            let perms2DArray = [];
            permsObjects.forEach((perm)=> perms2DArray.push([perm.perm_name , perm.perm_id]));
            return new Map(perms2DArray); // return hashing of all perms with it's id 
       }
     
     isPermExist(perm){
        return this.perms.has(perm)
    }

}


module.exports =  perms // export an instance
