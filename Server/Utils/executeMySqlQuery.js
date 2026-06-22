
const getConnectionPool = require("./connect_ems_db").getConnectionPool;
const consoleLog = require("../Utils/consoleLog");
async function executeMySqlQuery(query, paramsArray = []) {
    const connectionPool = getConnectionPool();

    try {
        const result = await new Promise((resolve, reject) => {

            const callback = (error, results) => {
                if (error) {
                    console.error("executeMySqlQuery error:", error);
                    return reject(error); // ❗ return real error
                }
                resolve(results);
            };

            if (paramsArray.length > 0) {
                connectionPool.query(query, paramsArray, callback);
            } else {
                connectionPool.execute(query, callback);
            }
        });

        return result ?? []; // ❗ never undefined

    } catch (error) {
        consoleLog(`executeMySqlQuery failed: ${error.message}`, "error");

        // ❗ IMPORTANT: rethrow or return safe value
        return []; // safest for SELECT queries
    }
}

module.exports = executeMySqlQuery;
