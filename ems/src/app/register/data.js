import { global_title } from "@/global_data";

let inputs_info = [ 
    {
        name:"user_email",
        label:"Email",
        type:"email",

        isRequired:true,

    },
    {
        name:"user_name",
        label:"Name",
        type:"text",

        isRequired:true,

    },
    {
        name:"user_password",
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
// not used to display options but used to access ref by name instead
// generated options are dynamically generated at form fields component
let select_specialty_options ={

    name:"emp_specialty",
}



let select_def = {select_title_options ,select_specialty_options}


export  {inputs_info , select_def}