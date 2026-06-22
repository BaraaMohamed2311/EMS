import { global_title,global_specialty , global_roles } from "@/global_data";

let inputs_info = [ 
    {

        label:"Email",
        type:"email",
        name:"user_email",
        

    },
    {

        label:"Name",
        type:"text",
        name:"user_name",
        

    }
    ,
    {

        label:"Bonus",
        type:"Number",
        name:"emp_bonus",
        

    }
    ,
    {

        label:"Salary",
        type:"Number",
        name:"emp_salary",
        

    }
    
];

// Title-specific fields mapping
const title_specific_fields = {
    "Doctor": [
        {
            label: "Initial Consultation Price",
            type: "number",
            name: "initial_consultation_price",
        },
        {
            label: "Follow-up Consultation Price",
            type: "number",
            name: "followup_consultation_price",
        },
        {
            label: "Years of Experience",
            type: "number",
            name: "years_of_exp",
        }
    ],
    "Surgeon": [
        {
            label: "Initial Consultation Price",
            type: "number",
            name: "initial_consultation_price",
        },
        {
            label: "Follow-up Consultation Price",
            type: "number",
            name: "followup_consultation_price",
        },
        {
            label: "Years of Experience",
            type: "number",
            name: "years_of_exp",
        },
        {
            label: "Surgery Price",
            type: "number",
            name: "surgery_price",
        }
    ],
    "Nurse": [
        {
            label: "Floor Number",
            type: "number",
            name: "floor_number",
        }
    ],
    // Add more titles as needed
};

// Helper function to get all fields for a specific title
export const getFieldsForTitle = (title) => {
    const specificFields = title_specific_fields[title] || [];
    return [...inputs_info, ...specificFields];
};


let select_role_options ={
     key:"role_name",
    label:"Select Role",
    name:"role_name",
    options:global_roles,

}


let check_box = {
  perms_check_box: [
    {
      label: "Modify Employee Data",
      value: "Modify Employee Data",
      name: "Modify Employee Data",
      type: "checkbox",
    },
    {
      label: "Modify Salary",
      value: "Modify Salary",
      name: "Modify Salary",
      type: "checkbox",
    },
    {
      label: "Display Salary",
      value: "Display Salary",
      name: "Display Salary",
      type: "checkbox",
    },
    {
      label: "Accept Registered",
      value: "Accept Registered",
      name: "Accept Registered",
      type: "checkbox",
    },
    {
      label: "Modify Employee Perms",
      value: "Modify Employee Perms",
      name: "Modify Employee Perms",
      type: "checkbox",
    },
    {
      label: "Modify Employee Role",
      value: "Modify Employee Role",
      name: "Modify Employee Role",
      type: "checkbox",
    },
    {
      label: "Delete User",
      value: "Delete User",
      name: "Delete User",
      type: "checkbox",
    },
  ],
};


let select_def = {select_role_options }

export  {inputs_info , select_def  , check_box , title_specific_fields }