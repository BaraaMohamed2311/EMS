 const global_perms = [
    { value: "Modify Data", text: "Modify Data" },
    { value: "Modify Salary", text: "Modify Salary" },
    { value: "Display Salary", text: "Display Salary" },
    { value: "Modify Perms", text: "Modify Perms" },
    { value: "Modify Role", text: "Modify Role" },
    { value: "Delete User", text: "Delete User" },
    { value: "Accept Registered", text: "Accept Registered" }
    ]
    




        // IT titles and specialties
const global_title = [
    { value: "Developer", text: "Developer" },
    { value: "Engineer", text: "Engineer" },
    { value: "Designer", text: "Designer" },
    { value: "Scientist", text: "Scientist" },
    { value: "HR", text: "HR" },
    { value: "DevOps Engineer", text: "DevOps Engineer" },
    { value: "Cloud Engineer", text: "Cloud Engineer" },
    { value: "Intern", text: "Intern" },
    { value: "CEO", text: "CEO" },
    { value: "Doctor", text: "Doctor" },
    { value: "Nurse", text: "Nurse" },
    { value: "Surgeon", text: "Surgeon" }
];

const global_speciality = [
    // IT specialities
    { value: "Front-End", text: "Front-End"  },
    { value: "Back-End", text: "Back-End"  },
    { value: "Full-Stack", text: "Full-Stack"  },
    { value: "Front-End", text: "Front-End" },
    { value: "Back-End", text: "Back-End" },
    { value: "Full-Stack", text: "Full-Stack" },
    { value: "Cloud", text: "Cloud" },
    { value: "UI/UX", text: "UI/UX" },
    { value: "Data", text: "Data" },
    { value: "HR", text: "HR" },
    { value: "Automation", text: "Automation" },
    { value: "Cloud", text: "Cloud" },
    { value: "Front-End", text: "Front-End" },
    { value: "Back-End", text: "Back-End" },
    { value: "Full-Stack", text: "Full-Stack" },
    { value: "Management", text: "Management" },

    // Hospital specialities
    { value: "Pediatrics (Kids)", text: "Pediatrics (Kids)" },
    { value: "Cardiology (Heart)", text: "Cardiology (Heart)" },
    { value: "Pulmonology (Lungs)", text: "Pulmonology (Lungs)" },
    { value: "Neurology (Brain)", text: "Neurology (Brain)" },
    { value: "Oncology (Cancer)", text: "Oncology (Cancer)" },
    { value: "Dermatology (Skin)", text: "Dermatology (Skin)" },

    { value: "Children''s Nursing", text: "Children''s Nursing" },
    { value: "Intensive Care Nursing", text: "Intensive Care Nursing" },
    { value: "Emergency Room Nursing", text: "Emergency Room Nursing" },
    { value: "Cancer Nursing", text: "Cancer Nursing" },

    { value: "Heart Surgery", text: "Heart Surgery" },
    { value: "Brain Surgery", text: "Brain Surgery" },
    { value: "Orthopedic Surgery", text: "Orthopedic Surgery" },
    { value: "ENT Surgery", text: "ENT Surgery" },
    { value: "Plastic Surgery", text: "Plastic Surgery" }
];

const global_mapped_specialities = {
  "Developer": [
    { value: "Front-End", text: "Front-End" },
    { value: "Back-End", text: "Back-End" },
    { value: "Full-Stack", text: "Full-Stack" }
  ],
  "Engineer": [
    { value: "Front-End", text: "Front-End" },
    { value: "Back-End", text: "Back-End" },
    { value: "Full-Stack", text: "Full-Stack" },
    { value: "Cloud", text: "Cloud" }
  ],
  "Designer": [
    { value: "UI/UX", text: "UI/UX" }
  ],
  "Scientist": [
    { value: "Data", text: "Data" }
  ],
  "HR": [
    { value: "HR", text: "HR" }
  ],
  "DevOps Engineer": [
    { value: "Automation", text: "Automation" }
  ],
  "Cloud Engineer": [
    { value: "Cloud", text: "Cloud" }
  ],
  "Intern": [
    { value: "Front-End", text: "Front-End" },
    { value: "Back-End", text: "Back-End" },
    { value: "Full-Stack", text: "Full-Stack" }
  ],
  "CEO": [
    { value: "Management", text: "Management" }
  ],

  "Doctor": [
    { value: "Pediatrics (Kids)", text: "Pediatrics (Kids)" },
    { value: "Cardiology (Heart)", text: "Cardiology (Heart)" },
    { value: "Pulmonology (Lungs)", text: "Pulmonology (Lungs)" },
    { value: "Neurology (Brain)", text: "Neurology (Brain)" },
    { value: "Oncology (Cancer)", text: "Oncology (Cancer)" },
    { value: "Dermatology (Skin)", text: "Dermatology (Skin)" }
  ],
  "Nurse": [
    { value: "Children''s Nursing", text: "Children''s Nursing" },
    { value: "Intensive Care Nursing", text: "Intensive Care Nursing" },
    { value: "Emergency Room Nursing", text: "Emergency Room Nursing" },
    { value: "Cancer Nursing", text: "Cancer Nursing" }
  ],
  "Surgeon": [
    { value: "Heart Surgery", text: "Heart Surgery" },
    { value: "Brain Surgery", text: "Brain Surgery" },
    { value: "Orthopedic Surgery", text: "Orthopedic Surgery" },
    { value: "ENT Surgery", text: "ENT Surgery" },
    { value: "Plastic Surgery", text: "Plastic Surgery" }
  ]
}


    
    const global_roles = [
            {value:"SuperAdmin", text:"SuperAdmin"},
            {value:"Admin", text:"Admin"},
            {value:"Employee", text:"Employee"},
    ]

        export  {global_perms  ,global_roles,global_title, global_speciality , global_mapped_specialities};