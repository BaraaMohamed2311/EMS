const { TableAliases } = require("../Tables/data");

function parseUpdatingStringByTable(updatingObj, FIELD_PRIORITY = null) {
    if (!updatingObj || typeof updatingObj !== 'object') {
        return {};
    }

    const { sql, values } = updatingObj;

    if (!sql || sql.trim() === '' || !Array.isArray(values)) {
        return {};
    }

    // alias → table
    const aliasToTable = {};
    Object.entries(TableAliases).forEach(([table, alias]) => {
        aliasToTable[alias] = table;
    });

    const result = {};

    // 🔥 track assigned fields globally (prevent remap)
    const assignedFields = new Set();

    const parts = sql.split(',').map(p => p.trim());
    let valueIndex = 0;

    parts.forEach(part => {
        const match = part.match(/^([a-z]+)\.([a-z_]+)\s*=\s*\?/i);
        
        if (match && valueIndex < values.length) {
            const alias = match[1];
            const fieldName = match[2];
            const value = values[valueIndex];

            let tableName;

            // ===============================
            // 🔥 PRIORITY LOGIC
            // ===============================
            if (FIELD_PRIORITY) {
                const priorityTable = FIELD_PRIORITY[fieldName];

                if (priorityTable) {
                    tableName = priorityTable;

                    // prevent duplicate assignment
                    if (assignedFields.has(fieldName)) {
                        valueIndex++;
                        return;
                    }
                } else {
                    // fallback but avoid remap
                    if (assignedFields.has(fieldName)) {
                        valueIndex++;
                        return;
                    }
                    tableName = aliasToTable[alias];
                }
            } else {
                // default behavior
                tableName = aliasToTable[alias];
            }

            if (tableName) {
                if (!result[tableName]) {
                    result[tableName] = {
                        fields: [],
                        values: []
                    };
                }

                result[tableName].fields.push(fieldName);
                result[tableName].values.push(value);

                if (FIELD_PRIORITY) {
                    assignedFields.add(fieldName);
                }
            }

            valueIndex++;
        }
    });

    // build final SQL per table
    const finalResult = {};
    Object.entries(result).forEach(([tableName, data]) => {
        const { fields, values: tableValues } = data;

        const setSql = fields.map(field => `${field} = ?`).join(', ');

        finalResult[tableName] = {
            sql: setSql,
            values: tableValues
        };
    });

    return finalResult;
}

module.exports = parseUpdatingStringByTable;