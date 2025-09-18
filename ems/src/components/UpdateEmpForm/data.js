import { global_title,global_speciality , global_roles } from "@/global_data";

let inputs_info = [ 
    {

        label:"Email",
        type:"email",
        name:"emp_email",
        

    },
    {

        label:"Name",
        type:"text",
        name:"emp_name",
        

    },
    {

        label:"Salary",
        type:"Number",
        name:"emp_salary",
        

    },
    {

        label:"Bonus",
        type:"Number",
        name:"emp_bonus",
        

    },
    {

        label:"Absence",
        type:"Number",
        name:"emp_abscence",
        

    }
    ,
    {

        label:"Rate",
        type:"Number",
        name:"emp_rate",
        

    }
    
];

let select_title_options ={

    label:"Select Job Title",
    name:"emp_title",
    options:global_title,

}

let select_speciality_options ={

    label:"Select Job Speciality",
    name:"emp_speciality",
    options:global_speciality,

}


let select_role_options ={

    label:"Select Role",
    name:"role_name",
    options:global_roles,

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
        

    },
    {

        label:"Modify Role",
        value:"Modify Role",
        name:"Modify Role",
        type:"checkbox",
        

    },
    {
        label:"Modify Perms",
        value:"Modify Perms",
        name:"Modify Perms",
        type:"checkbox",
        

    },
    {

        label:"Modify Salary",
        value:"Modify Salary",
        name:"Modify Salary",
        type:"checkbox",
        

    },
    {
        
        label:"Accept Registered User",
        value:"Accept Registered",
        name:"Accept Registered",
        type:"checkbox",
        

    },
    {

        label:"Display Salary",
        value:"Display Salary",
        name:"Display Salary",
        type:"checkbox",
        

    }

];

let select_options = {select_title_options, select_speciality_options  , select_role_options }

export  {inputs_info , select_options  , check_box}