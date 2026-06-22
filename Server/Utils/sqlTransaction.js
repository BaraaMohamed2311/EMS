const getConnectionPool = require("./connect_ems_db").getConnectionPool;
const consoleLog = require("../Utils/consoleLog");

/**
 * Execute multiple queries in a transaction with parameterized values
 * @param {Array<string>} queries - Array of SQL query strings with ? placeholders
 * @param {Array<Array>} params - Array of parameter arrays, one for each query
 * @returns {Promise<boolean>}
 */
async function sqlTransaction(queries, params = []) {
    const connectionPool = getConnectionPool();
    return new Promise((resolve, reject) => {
        connectionPool.getConnection(async (err, connection) => {
            if (err) {
                consoleLog(`Error getting connection: ${err}`, "error");
                return reject(err);
            }

            try {
                // Start the transaction
                await connection.promise().beginTransaction();
                
                // Execute each query in order with its corresponding params
                for (let i = 0; i < queries.length; i++) {
                    const query = queries[i];
                    const queryParams = params[i] || []; // Use empty array if no params
                    
                    await connection.promise().execute(query, queryParams);
                }
        
                // Commit the transaction
                await connection.promise().commit();
                console.log("Transaction successfully committed.");
                connection.release(); // Release the connection
                resolve(true);
                
            } catch (error) {
                // Rollback if an error occurs
                await connection.promise().rollback();
                consoleLog(`Transaction error, rolling back: `, "error");
                console.log(error);
                connection.release(); // Release the connection even on error
                reject(error);
            }
        });
    });
}

module.exports = sqlTransaction;