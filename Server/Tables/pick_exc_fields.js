const SELF_UPDATE_FIELDS = [
  "user_name",
  "user_email",
  "patient_address",
  "patient_phone",
  "patient_address",
  "date_of_birth",
  "emergency_contact",
  "patient_gender",
];

const EXCLUDE_UPDATE_FIELDS = [
  "emp_id",
  "user_id",
  "staff_id",
  "hosp_emp_id"
];

function pickAllowedFields(source, allowed) {
  const forbiddenFields = Object.keys(source).filter(key => !allowed.includes(key));
  if (forbiddenFields.length > 0) {
    console.warn(`Attempted to update forbidden fields: ${forbiddenFields.join(", ")}`);
  }
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => allowed.includes(key))
  );
}

function excludeFields(source, excluded) {
  const forbiddenFields = Object.keys(source).filter(key => excluded.includes(key));
  if (forbiddenFields.length > 0) {
    console.warn(`Attempted to update excluded fields: ${forbiddenFields.join(", ")}`);
  }
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !excluded.includes(key))
  );
}



module.exports = {SELF_UPDATE_FIELDS,EXCLUDE_UPDATE_FIELDS,excludeFields , pickAllowedFields};