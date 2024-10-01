export default function pickRoleIcon(role_name){
    switch(role_name){
        case "SuperAdmin":
            return "/SuperAdmin.svg"
        
        case "Admin":
            return "/Admin.svg"

        case "Employee":
            return "/Employee.svg"
    }
}