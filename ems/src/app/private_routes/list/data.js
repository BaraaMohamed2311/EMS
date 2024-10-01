import { global_jobs, global_perms, global_roles } from "@/global_data"

let selectsElementsData = [
    {   
        ref: null,
        key:"By Position",
        label:"By Position",
        name:"emp_position",
        options:[
            ...global_jobs,
            {value:"Position Filter", text:"Position Filter" , selected : true}
        ],
        
    },
    {   
        ref: null,
        key:"By Role",
        label:"By Role",
        name:"role_name",
        options:[
            ...global_roles,
            {value:"Role Filter", text:"Role Filter" , selected : true}
        ],
        
    },
    {   
        ref: null,
        key:"By Perms",
        label:"By Perms",
        name:"emp_perms",
        options:[
            ...global_perms,
            {value:"Perms Filter", text:"Perms Filter" , selected : true}
        ],
        
    }

]


export  default selectsElementsData