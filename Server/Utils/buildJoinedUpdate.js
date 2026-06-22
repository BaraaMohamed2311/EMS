const { Tables, TableAliases, fieldToTableMap, roleToEntityMap } = require("../Tables/data"); 

// ------------------------------
// Main Function - Returns SQL with placeholders and values
// ------------------------------
function buildJoinedUpdate(newUpdateData, entityType = null) {
  if (!newUpdateData || typeof newUpdateData !== "object") {
    return { sql: "", values: [] };
  }

  // 1. Group filters by table
  const tableGroups = {};

  for (const rawKey in newUpdateData) {
    const value = newUpdateData[rawKey];

    // 2. Find which table contains this field (with entity context)
    const tableName = findTableByField(rawKey, entityType);

    if (!tableName || !TableAliases[tableName]) {
      console.warn(`No alias or table found for field: ${rawKey}, entityType: ${entityType}`);
      continue;
    }

    // 3. Prepare entry
    if (!tableGroups[tableName]) tableGroups[tableName] = [];
    tableGroups[tableName].push([rawKey, value]);
  }

  // 4. Build joined filters for each table
  const parts = [];
  const values = [];

  for (const tableName in tableGroups) {
    const alias = TableAliases[tableName];
    const filterEntries = tableGroups[tableName];

    const { sql, values: entryValues } = buildSetClause(filterEntries, alias);
    if (sql) {
      parts.push(sql);
      values.push(...entryValues);
    }
  }

  // 5. Join all parts
  const sql = parts.length > 0 ? parts.join(" , ") : "";
  
  return { sql, values };
}

// ------------------------------
// Build SET clause with placeholders
// ------------------------------
function buildSetClause(entries, alias) {
  const setParts = [];
  const values = [];

  for (const [field, value] of entries) {
    // Use alias.field = ? format
    setParts.push(`${alias}.${field} = ?`);
    values.push(value);
  }

  const sql = setParts.join(" , ");
  return { sql, values };
}

// ------------------------------
// Find table containing a field with entity context
// ------------------------------
function findTableByField(field, entityType = null) {
  // Step 1: Check if field is in the ambiguous mapping (fieldToTableMap)
  if (fieldToTableMap && fieldToTableMap[field]) {
    const mapping = fieldToTableMap[field];
    
    // If entity type provided and has specific mapping, use it
    if (entityType && mapping[entityType]) {
      console.log(`Found ${field} in fieldToTableMap for ${entityType}: ${mapping[entityType]}`);
      return mapping[entityType];
    }
    
    // Otherwise use default mapping
    if (mapping.default) {
      console.log(`Found ${field} in fieldToTableMap default: ${mapping.default}`);
      return mapping.default;
    }
  }

  // Step 2: If entityType is provided, search in entity-specific tables first
  if (entityType) {
    // Get the entity table name from roleToEntityMap
    const entityTable = roleToEntityMap[entityType];
    
    console.log(`Entity type: ${entityType}, Entity table: ${entityTable}`);
    
    // Priority search order: entity-specific table → employees → users
    const priorityTables = [
      entityTable,           // e.g., 'doctors', 'nurses', 'surgeons'
      'employees',           // Common employee fields
      'employees_hospital',  // Hospital employee fields
      'users'                // User fields
    ].filter(Boolean);      // Remove null/undefined values

    console.log(`Priority tables for ${field}:`, priorityTables);

    // Search in priority tables first
    for (const tableName of priorityTables) {
      const columns = Tables[tableName];
      
      // Safety check: ensure table exists and has columns
      if (!columns) {
        console.warn(`Table ${tableName} not found in Tables definition`);
        continue;
      }
      
      if (!Array.isArray(columns)) {
        console.warn(`Table ${tableName} columns is not an array:`, columns);
        continue;
      }
      
      if (columns.includes(field)) {
        console.log(`Found ${field} in ${tableName}`);
        return tableName;
      }
    }
  }

  // Step 3: Standard lookup - search all tables if not found in priority tables
  console.log(`Falling back to standard search for field: ${field}`);
  
  for (const tableName in Tables) {
    const columns = Tables[tableName];
    
    // Safety check
    if (!Array.isArray(columns)) {
      continue;
    }
    
    if (columns.includes(field)) {
      console.log(`Found ${field} in ${tableName} (standard search)`);
      return tableName;
    }
  }

  console.warn(`Field ${field} not found in any table`);
  return null;
}

module.exports = buildJoinedUpdate;