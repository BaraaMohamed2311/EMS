const { Tables ,TableAliases} = require("../Tables/data"); 
const JoinFiltering = require("./JoinFiltering");

// ------------------------------
// Main Function
// ------------------------------
function buildJoinedFilters(restFilters) {
  if (!restFilters || typeof restFilters !== "object") return "";

  // 1. Group filters by table
  const tableGroups = {};

  for (const rawKey in restFilters) {
    const value = restFilters[rawKey];

    // Support fields like "patient_gender:ne"
    // const [field, operator = "eq"] = rawKey.split(":");

    // 2. Find which table contains this field
    const tableName = findTableByField(rawKey);

    if (!TableAliases[tableName]) {
      console.warn(`No alias or table found for field: ${rawKey}`);
      continue;
    }

    // 3. Prepare entry
    if (!tableGroups[tableName]) tableGroups[tableName] = [];
    /* creates tableGroups keys are tables and values are entries of fields
      {
        users: [
          [ 'user_email', 'mahmoud.tarek3417@gmail.com' ],
          [ 'user_name', 'max' ]
        ],
        patients: [ [ 'patient_phone', '01572723340' ] ]
      }
    */
    tableGroups[tableName].push([rawKey,value]);
  }

  // 4. Build joined filters for each table
  const parts = [];

  for (const tableName in tableGroups) {
    const alias = TableAliases[tableName];
    const filterEntries = tableGroups[tableName];

    const sqlPart = JoinFiltering(filterEntries, alias);
    if (sqlPart) parts.push(sqlPart);
  }

  // 5. Join all parts
  return parts.length > 0 ? parts.join(" AND ") : "";
}

// ------------------------------
// Find table containing a field
// ------------------------------
function findTableByField(field) {
  for (const tableName in Tables) {
    const columns = Tables[tableName];
    if (Array.isArray(columns) && columns.includes(field)) {
      return tableName;
    }
  }
  return null;
}

module.exports = buildJoinedFilters;
