// WARNING: DO not include system-specific tables of other systems here
// For example, do not add hospital_perms here in tables or aliases as it's related to hospital system and adding it will cause a conflict
// Only tables that doesn't change across systems can be added
const Tables = {
  // ==========================================
  // Core Users Table
  // ==========================================
  users: [
    "user_id",
    "user_email",
    "user_name",
    "user_password",
    "user_type",
  ],

  // ==========================================
  // Employee Related Tables
  // ==========================================
  employees: [
    "emp_id",
    "emp_salary",
    "emp_abscence",
    "emp_bonus",
    "emp_rate",
    "emp_title",
    "emp_specialty"
  ],

  employees_hospital: [
    "hosp_emp_id",
    "emp_id",
    "emp_title"
  ],

  unregistered_employees: [
    "emp_id",
    "user_name",
    "emp_title",
    "emp_specialty",
    "user_password",
    "user_email"
  ],

  roles: [
    "emp_id",
    "role_name"
    ],
  perms: [
    "perm_id",
    "perm_name"
  ],
  employee_perms: [
    "perm_id", 
    "emp_id"
  ],

  // ==========================================
  // Medical Staff Tables
  // ==========================================
  doctors: [
    "emp_id",
    "hosp_emp_id",
    "initial_consultation_price",
    "followup_consultation_price",
    "years_of_exp"
  ],

  surgeons: [
    "emp_id",
    "hosp_emp_id",
    "initial_consultation_price",
    "followup_consultation_price",
    "surgery_price",
    "years_of_exp"
  ],

  nurses: [
    "emp_id",
    "hosp_emp_id",
    "floor_number"
  ],

  // ==========================================
  // Patient Related Tables
  // ==========================================
  patients: [
    "user_id",
    "patient_phone",
    "patient_address",
    "isAssignedToRoom",
    "room_number",
    "floor_number",
    "date_of_birth",
    "next_check_date",
    "patient_gender",
    "emergency_contact",
    "created_at"
  ],

  staff_patient: [
    "staff_id",
    "user_id",
    "relation_type",
    "assigned_date"
  ],


  // ==========================================
  // Scheduling & Availability Tables
  // ==========================================
  availability: [
    "availability_id",
    "hosp_emp_id",
    "day_of_week",
    "start_time",
    "end_time",
    "created_at",
    "updated_at"
  ],

  consultations: [
    "consultation_id",
    "hosp_emp_id",
    "user_id",
    "availability_id",
    "consultation_date",
    "start_time",
    "end_time",
    "consultation_status",
    "created_at",
    "consultation_type"
  ],

  // ==========================================
  // Facility Management Tables
  // ==========================================
  floors: [
    "floor_id",
    "floor_number"
  ],

  rooms: [
    "room_id",
    "room_number",
    "floor_id",
    "user_id",
    "isOccupied"
  ],

  // ==========================================
  // Legacy Tables
  // ==========================================
  doctor_availability: [
    "availability_id",
    "emp_id",
    "day_of_week",
    "start_time",
    "end_time",
    "created_at",
    "updated_at"
  ]
};


const TableAliases = {
  users: 'u',
  patients: 'p',
  employees: 'e',
  employees_hospital: 'eh',
  doctors: 'd',
  surgeons: 's',
  nurses: 'n',  // ← ADD THIS
  roles: 'r',
  consultations: 'c',
  availability: 'a',
  staff_patient: 'sp',
  perms: 'p',
  employee_perms: 'ep',
  floors: 'f',
  rooms: 'rm',
};

const permNames = [
  "Modify Employee Data",
  "Modify Salary",
  "Display Salary",
  "Accept Registered",
  "Modify Employee Perms",
  "Modify Employee Role",
  "Delete User"
];


const setOfPerms = new Set(permNames);

// ==========================================
// Field to Table Mapping for Ambiguous Fields
// ==========================================
const fieldToTableMap = {
  // floor_number exists in nurses, patients, and floors tables
  'floor_number': {
    'nurse': 'nurses',
    'patient': 'patients',
    'default': 'floors'
  },
  // Add other ambiguous fields here if needed
  // Example:
  // 'room_number': {
  //   'patient': 'patients',
  //   'default': 'rooms'
  // }
};

const approvalRequiredFields = {
  patients: [],
  employees: [],
  doctors: ['initial_consultation_price', 'followup_consultation_price', 'years_of_exp'],
  surgeons: ['initial_consultation_price', 'followup_consultation_price', 'surgery_price', 'years_of_exp'],
  nurses: ['floor_number'],

};

const roleToEntityMap = {
  patient: 'patients',
  employee: 'employees',
  doctor: 'doctors',
  surgeon: 'surgeons',
  nurse: 'nurses',
};

const hospitalJobs = new Set(["Doctor", "Nurse", "Surgeon"]);

module.exports = {TableAliases , Tables ,setOfPerms ,approvalRequiredFields,roleToEntityMap , hospitalJobs};