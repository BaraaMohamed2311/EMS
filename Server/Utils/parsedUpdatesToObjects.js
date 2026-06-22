function parsedUpdatesToObjects(parsedUpdates, FIELD_PRIORITY = null) {
    const result = {};
    
    // 🔥 Track globally assigned fields (to prevent remapping)
    const assignedFields = new Set();

    Object.entries(parsedUpdates).forEach(([tableName, updateData]) => {
        if (!updateData || typeof updateData !== 'object') {
            result[tableName] = {};
            return;
        }

        const { sql, values } = updateData;
        
        if (!sql || sql.trim() === '' || !Array.isArray(values)) {
            result[tableName] = {};
            return;
        }
        
        // Parse SQL → field names
        const fieldMatches = sql.matchAll(/([a-z_]+)\s*=\s*\?/gi);
        const fieldNames = Array.from(fieldMatches, match => match[1]);

        fieldNames.forEach((fieldName, index) => {
            if (index >= values.length) return;

            const value = values[index];

            // ===============================
            // 🔥 PRIORITY LOGIC
            // ===============================
            if (FIELD_PRIORITY) {
                const priorityTable = FIELD_PRIORITY[fieldName];

                // ✅ Case 1: Field has priority → force assign
                if (priorityTable) {
                    if (!result[priorityTable]) result[priorityTable] = {};

                    // Prevent duplicate assignment
                    if (!assignedFields.has(fieldName)) {
                        result[priorityTable][fieldName] = value;
                        assignedFields.add(fieldName);
                    }

                    return; // skip normal flow
                }

                // ✅ Case 2: No priority → fallback but avoid remap
                if (assignedFields.has(fieldName)) {
                    return;
                }
            }

            // ===============================
            // 🧠 DEFAULT LOGIC (unchanged)
            // ===============================
            if (!result[tableName]) result[tableName] = {};

            result[tableName][fieldName] = value;

            if (FIELD_PRIORITY) {
                assignedFields.add(fieldName);
            }
        });
    });

    return result;
}

module.exports =parsedUpdatesToObjects;