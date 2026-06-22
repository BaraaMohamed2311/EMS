const SuperAdmin = require("../../Classes/Roles/SuperAdmin");
//===========================================================
//              Help in Choosing Role Class to Execute Task
//===========================================================
async function ModifyOtherUserRole(modifierRole, other_user_id, other_user_Role, other_user_new_role, other_user_email,failing_messages) {

        // Modidify Role

        if(modifierRole === "SuperAdmin"){
            const result =await SuperAdmin.ChangeOtherUserRole(other_user_id , other_user_Role , other_user_new_role )
            if(!result.success){
                failing_messages.push({success:false , message:result.message})
            }
        }
        else{
            failing_messages.push({success:false , message: "You must be SuperAdmin to modify roles"})
        }


}

    module.exports = ModifyOtherUserRole;