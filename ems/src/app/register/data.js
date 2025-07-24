import { global_jobs } from "@/global_data";

let inputs_info = [ 
    {
        name:"emp_email",
        label:"Email",
        type:"email",

        isRequired:true,

    },
    {
        name:"emp_name",
        label:"Name",
        type:"text",

        isRequired:true,

    },
    {
        name:"emp_password",
        label:"Password",
        type:"password",

        isRequired:true,

    },
    
];

let select_position_options ={
    key:"Select Job Title",
    label:"Select Job Title",
    name:"emp_position",
    options:global_jobs,
    ref:null
}

let select_options = {select_position_options:select_position_options}


export  {inputs_info , select_options}