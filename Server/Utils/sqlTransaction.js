const connectionPool = require("./connect_ems_db");
const consoleLog = require("../Utils/consoleLog");


async function sqlTransaction(queries) {
    return new Promise((resolve , reject)=>{
        connectionPool.getConnection(async (err , connection)=>{
            try {
                // Start the transaction
                 connection.beginTransaction();
                // Execute each query in order
                for (let query of queries) {
                    await connection.promise().execute(query);
                }
        
                // Commit the transaction
                connection.commit();
                console.log("Transaction successfully committed.");
                connection.release(); // Release the connection
                resolve(true)
            } catch (error) {
                    connection.rollback(); // Rollback if an error occurs
                    consoleLog(`Transaction error, rolling back: ${error}`, "error");
                    reject(error)
            }
        });
    })
    
}

module.exports = sqlTransaction;


/*connectionPool.getConnection(async (err , connection)=>{
        try {
            // Start the transaction
             connection.beginTransaction();
            // Execute each query in order
            for (let query of queries) {
                await connection.promise().execute(query);
            }
    
            // Commit the transaction
            connection.commit();
            console.log("Transaction successfully committed.");
            state = true;
            console.log("State inside" , state)
        } catch (error) {
            if (connection) {
                connection.rollback(); // Rollback if an error occurs
                consoleLog(`Transaction error, rolling back: ${error}`, "error");
            }
        } finally {
            connection.release(); // Release the connection
        }
    });*/
