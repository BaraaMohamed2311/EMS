const SuperAdmin = require("../../Classes/Roles/SuperAdmin");
const Admin = require("../../Classes/Roles/Admin");
const User = require("../../Classes/User");
const buildJoinedUpdate = require("../buildJoinedUpdate");
const stringifyFields = require("../stringifyFields");
//===========================================================
//              Help in Choosing Role Class to Execute Task
//===========================================================
async function ModifyOtherUserData(other_user_id, other_user_Role,other_user_title, modifierRole, newOtherUserData, oldOtherUserEmail ,failing_messages) {
    // This function is used to Modify Employee Data in the database
    // It will be implemented later

        // If email is updated make sure it's not in the system
        if(newOtherUserData.user_email && oldOtherUserEmail && oldOtherUserEmail !== newOtherUserData.user_email){
            // if email is changed we check if it exists in db
            const emailExists = await User.checkIfUserExistsByEmail(newOtherUserData.user_email);
                if(emailExists){
                    failing_messages.push({success:false , message: "That Email Already Exists"})
                }
        }


        // updating string for alias1.col1=new_value , alias2.col2=new_value2 , ...
        // inserting object for (col1,col2) values (val1,val2) on first time insert
        const entityType = other_user_title?.toLowerCase();
        const updatingObj = buildJoinedUpdate(newOtherUserData,entityType);

        if(modifierRole === "SuperAdmin"){
            const result = await SuperAdmin.EditOtherUserData(other_user_id ,other_user_Role, other_user_title , updatingObj  )
            if(!result.success){
                failing_messages.push({success:false , message:result.message})
            }
        }
        else if (modifierRole === "Admin"){
        const result = await Admin.EditOtherUserData(other_user_id ,other_user_Role,other_user_title , updatingObj  )
            if(!result.success){
                failing_messages.push({success:false , message:result.message})
            }
        }
        else{
            failing_messages.push({success:false , message: "You are not authorized to modify user Data"})
        }

        
        
    
}

module.exports = ModifyOtherUserData;