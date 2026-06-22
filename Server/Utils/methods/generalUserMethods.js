const executeMySqlQuery = require("../executeMySqlQuery");

    // ================================================================================================================
    //              This class is to fetch general data about any user even if they don't have a implemented class
    // ================================================================================================================
class generalUserMethods {


    // ============================
    //              GET
    // ============================

    static async getUserData(user_id , isLoginData = false){

      const query = `SELECT 
                user_id,
                user_email,
                ${isLoginData && "user_password,"}
                user_name FROM users  WHERE user_id = ${user_id}`;

        const result = await executeMySqlQuery(query);
        
        return result[0];
    }

    static async getUserEmpData(user_id){

      const query = `SELECT 
                    emp_abscence,
                    emp_rate,
                    emp_title,
                    emp_specialty FROM employees  WHERE emp_id = ${user_id}`;

        const result = await executeMySqlQuery(query);
        
        return result[0];
    }



}

module.exports = generalUserMethods;