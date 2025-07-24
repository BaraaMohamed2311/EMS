import { global_jobs, global_perms, global_roles } from "@/global_data"

let selectsElementsData = [
    {   
        ref: null,
        key:"By Position",
        label:"By Position",
        name:"emp_position",
        options:global_jobs,
        
    },
    {   
        ref: null,
        key:"By Role",
        label:"By Role",
        name:"role_name",
        options:global_roles,
        
    },
    {   
        ref: null,
        key:"By Perms",
        label:"By Perms",
        name:"emp_perms",
        options:global_perms,
    }

]
 

export  default selectsElementsData