
const connectionPool = require("./connect_ems_db");
const consoleLog = require("../Utils/consoleLog");

async function executeMySqlQuery(query, paramsArray=[]) {
    try {
        // we use promise to get returned results from resolve
        const executeQuery = (query) => {
            return new Promise((resolve, reject) => {

                if(paramsArray.length > 0 ){
                    // can't use paramsArray with execute() so we use query()
                    connectionPool.query(`${query};`, paramsArray , (error, results) => {
                        if (error) {
                            console.error(`executeMySqlQuery error ` ,error );
                            return reject(false); // Reject on error
                        }
                        resolve(results); 
                    });
                }
                else{
                    connectionPool.execute(`${query};`, (error, results) => {
                        if (error) {
                            console.error(`executeMySqlQuery error ` ,error );
                            return reject(false); // Reject on error
                        }
                        resolve(results); 
                    });
                }
                
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
