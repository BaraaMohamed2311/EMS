import { global_jobs , global_roles } from "@/global_data";

let inputs_info = [ 
    {

        label:"Email",
        type:"email",
        name:"emp_email",
        ref: null,

    },
    {

        label:"Name",
        type:"text",
        name:"emp_name",
        ref: null,

    },
    {

        label:"Salary",
        type:"Number",
        name:"emp_salary",
        ref: null,

    },
    {

        label:"Bonus",
        type:"Number",
        name:"emp_bonus",
        ref: null,

    },
    {

        label:"Absence",
        type:"Number",
        name:"emp_abscence",
        ref: null,

    }
    
];

let select_position_options ={

    label:"Select Job Title",
    name:"emp_position",
    options:global_jobs,
    ref: null
}


let select_role_options ={

    label:"Select Role",
    name:"role_name",
    options:global_roles,
    ref: null
}

/* 
       "AR" => Accept Registered User
       "MD" => Modify Data Users
       "MR" => Modify Role
       "MP" => Modify Perms
       "MS" => Modify Salary
       */

let check_box = [ 
    {
        label:"Modify Data",
        value:"Modify Data",
        name:"Modify Data",
        type:"checkbox",
        ref: null,

    },
    {

        label:"Modify Role",
        value:"Modify Role",
        name:"Modify Role",
        type:"checkbox",
        ref: null,

    },
    {
        label:"Modify Perms",
        value:"Modify Perms",
        name:"Modify Perms",
        type:"checkbox",
        ref: null,

    },
    {

        label:"Modify Salary",
        value:"Modify Salary",
        name:"Modify Salary",
        type:"checkbox",
        ref: null,

    },
    {
        
        label:"Accept Registered User",
        value:"Accept Registered",
        name:"Accept Registered",
        type:"checkbox",
        ref: null,

    },
    {

        label:"Display Salary",
        value:"Display Salary",
        name:"Display Salary",
        type:"checkbox",
        ref: null,

    }

];

let select_options = {select_position_options: select_position_options , select_role_options : select_role_options}

export  {inputs_info , select_options  , check_box}