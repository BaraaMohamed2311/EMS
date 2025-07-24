const SuperAdmin = require("../../Classes/SuperAdmin");
async function ModifyRole(modifierRole, emp_id, userRole, newRole, employee_emp_email,failing_messages) {

        // Modidify Role
        if(modifierRole === "SuperAdmin"){
            const succeeded =await SuperAdmin.ChangeOtherUserRole(emp_id , userRole , newRole , employee_emp_email)
            if(!succeeded){
            failing_messages.push({success:false , message: "Failed To Modify User Role"})
            }
        }


}

    module.exports = ModifyRole;