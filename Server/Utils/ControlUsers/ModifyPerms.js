
const SuperAdmin = require("../../Classes/SuperAdmin");
async function ModifyPerms(emp_id, userRole, modifierRole, newperms , oldUserpermsSet,failing_messages) {

        if(modifierRole === "SuperAdmin"){
            const succeeded =await SuperAdmin.ChangeOtherUserperms(emp_id , userRole , newperms , oldUserpermsSet)
            if(!succeeded){
                failing_messages.push({success:false , message: "Failed To Modify User perms"})
            }
        }
    
    

}

module.exports = ModifyPerms;