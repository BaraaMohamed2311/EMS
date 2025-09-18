import {  global_perms, global_roles , global_title,global_speciality} from "@/global_data"

let selectsElementsData = [
    {   
        ref: null,
        key:"By Title",
        label:"By Title",
        name:"emp_title",
        options:global_title,
        
    },
    {   
        ref: null,
        key:"By Speciality",
        label:"By Speciality",
        name:"emp_specialty",
        options:global_speciality,
        
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