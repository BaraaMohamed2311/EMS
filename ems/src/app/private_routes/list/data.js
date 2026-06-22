import {  global_perms, global_roles , global_title,global_specialty} from "@/global_data"
let inputs_info= [
    {  key:"user_email",label:"Email", name: "user_email", type: "email" },
    { key:"user_name",label:"Name", name: "user_name", type: "text" },
]

let select_def = [
    {   
        ref: null,
        key:"By Title",
        label:"By Title",
        name:"emp_title",
        options:global_title,
        
    },
    {   
        ref: null,
        key:"By specialty",
        label:"By specialty",
        name:"emp_specialty",
        options:global_specialty,
        
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
 

export  {select_def , inputs_info}