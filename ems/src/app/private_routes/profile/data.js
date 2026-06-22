const selfEditableFields = {
  shared: {
    inputs_info: [
      {
        key: "user_email",
        label: "Email",
        name: "user_email",
        type: "email",
      },
      { 
        key: "user_name",
        label: "Name",
        name: "user_name",
        type: "text",
      }
      
    ],
  },

  patient: {
    inputs_info: [
      {
        key: "patient_phone",
        label: "Phone Number",
        name: "patient_phone",
        type: "tel",
      },
      {
        key: "patient_address",
        label: "Address",
        name: "patient_address",
        type: "text",
      },
      
      {
        key: "date_of_birth",
        label: "Date of Birth",
        name: "date_of_birth",
        type: "date",
      },
      {
        key: "emergency_contact",
        label: "Emergency Contact",
        name: "emergency_contact",
        type: "text",
      },
    ],
    select_def:{
      select_gender:{
        key: "patient_gender",
        label: "Gender",
        name: "patient_gender",
        type: "select",
        options: ["Male", "Female", "Other"]}
      },
  },

  doctor: {
    inputs_info: [],
  },

  surgeon: {
    inputs_info: [],
  },

  nurse: {
    inputs_info: [],
  },
};

const approvalRequiredFields = {
  shared: {
    inputs_info: [],
  },

  patient: {},

  doctor: {},

  surgeon: {},

  nurse: {},
};




export { selfEditableFields , approvalRequiredFields };
