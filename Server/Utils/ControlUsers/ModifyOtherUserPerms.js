
const SuperAdmin = require("../../Classes/Roles/SuperAdmin");
const Admin = require("../../Classes/Roles/Admin");
//===========================================================
//              Help in Choosing Role Class to Execute Task
//===========================================================
async function ModifyOtherUserPerms(emp_id, userRole, modifierRole, newpermsSet , oldUserpermsSet,failing_messages) {
    
        if(modifierRole === "SuperAdmin"){
            const result =await SuperAdmin.ChangeOtherUserperms(emp_id , userRole , newpermsSet , oldUserpermsSet)
            if(!result.success){
                failing_messages.push({success:false , message:result.message})
            }
        }
        else if(modifierRole === "Admin"){
            const result =await Admin.ChangeOtherUserperms(emp_id , userRole , newpermsSet , oldUserpermsSet)
            if(!result.success){
                failing_messages.push({success:false , message:result.message})
            }
        }
        else{
            failing_messages.push({success:false , message:"A valid role is required for this action"})
        }
    

}

module.exports = ModifyOtherUserPerms;