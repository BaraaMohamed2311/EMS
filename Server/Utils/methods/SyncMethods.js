const executeMySqlQuery = require("../executeMySqlQuery");

class SyncMethods {

    // ================================================
    // 1) Employees full data (global version)
    // ================================================
    static async syncAllEmployeesFullData( max_version) {
        const fallbackToDB = !max_version || max_version === "undefined" || max_version === "null";

        // fetch global version for employees
        const versionQuery = `
            SELECT current_version
            FROM table_version
            WHERE table_name = 'ems_employees';
        `;
        const versionResult = await executeMySqlQuery(versionQuery);
        const globalVersion = versionResult[0]?.current_version ?? 0;

        return {
            needsSync: fallbackToDB || (max_version < globalVersion),
            latest_version: globalVersion
        };
    }


}

module.exports = SyncMethods;
