
const connectionPool = require("./connect_ems_db");
const consoleLog = require("../Utils/consoleLog")
async function executeMySqlQuery(query, error_msg) {
    try {
        // we use promise to get returned results from resolve
        const executeQuery = (query) => {
            return new Promise((resolve, reject) => {
                connectionPool.query(`${query};`, (error, results) => {
                    if (error) {
                        console.error(`executeMySqlQuery error ` ,error );
                        return reject(false); // Reject on error
                    }
                    resolve(results); // Resolve if no error
                });
            });
        };

        // Execute the first query
        const result = await executeQuery(query); // Wait for the first query to complete
        return result;
    } catch (error) {
        consoleLog(`executeMySqlQuery catch error ${error}` , "error");
    }
}

module.exports = executeMySqlQuery;
