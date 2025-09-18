import { global_title, global_speciality } from "@/global_data";

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

let select_title_options ={
    key:"Select Job Title",
    label:"Select Job Title",
    name:"emp_title",
    options:global_title,

}

let select_speciality_options ={
    key:"Select Job Speciality",
    label:"Select Job Speciality",
    name:"emp_specialty",
    options:global_speciality,

}

let select_options = {select_title_options, select_speciality_options}


export  {inputs_info , select_options}