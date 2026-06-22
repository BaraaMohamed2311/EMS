
const executeMySqlQuery = require("../Utils/executeMySqlQuery");
const bcrypt = require("bcrypt");

class User {

    static async checkIfUserExistsById(user_id) {
        // SELECT EXISTS() stopps at first found row, more efficient than COUNT(*)
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE user_id = ?) AS user_exists`;
    const result = await executeMySqlQuery(query, [user_id]);
    return result[0]?.user_exists === 1; 
}

static async checkIfUserExistsByEmail(user_email) {
    // SELECT EXISTS() stopps at first found row, more efficient than COUNT(*)
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE user_email = ?) AS user_exists`;
    const result = await executeMySqlQuery(query, [user_email]);
    return result[0]?.user_exists === 1; 
}

static async getUserTypeById(user_id) {
    // LIMIT 1 stopps at first found row
    const query = `SELECT user_type FROM users WHERE user_id = ? LIMIT 1`;
    const result = await executeMySqlQuery(query, [user_id]);
    return result[0]?.user_type || null;
}

static async getUserTypeByEmail(user_email) {
    // LIMIT 1 stopps at first found row
    const query = `SELECT user_type FROM users WHERE user_email = ? LIMIT 1`;
    const result = await executeMySqlQuery(query, [user_email]);
    return result[0]?.user_type || null;
}

static async getUserIDByEmail(user_email) {
    // LIMIT 1 stopps at first found row
    const query = `SELECT user_id FROM users WHERE user_email = ? LIMIT 1`;
    const result = await executeMySqlQuery(query, [user_email]);
    return result[0]?.user_id || null;
}

static async getUserEmailByID(user_id) {
    // LIMIT 1 stopps at first found row
    const query = `SELECT user_id FROM users WHERE user_id = ? LIMIT 1`;
    const result = await executeMySqlQuery(query, [user_id]);
    return result[0]?.user_email || null;
}



    // =============================
    //              Get
    // =============================
    static async getUserIDAndTable(user_email){
            if (!user_email)  return console.error("User email is required");

            // Get user type first
            const userType = await this.getUserTypeByEmail(user_email);
            if(!userType)  return console.error("User type could not be determined");
            // Get user external ID at corresponding table
            const user_id = await this.getUserIDByEmail(user_email);
            if(!user_id)  return console.error("User user_id is undefined");

            if (userType === "employee") {
                return { user_id: user_id, table: "employees" }; 
            }
            else if (userType === "patient") {
                return { user_id: user_id, table: "patients" }; 
            }

        }


        static async getUserEmailAndTable(user_id){
        if (user_id) {
            const query_employees = `
                SELECT user_email FROM employees WHERE emp_id = ? LIMIT 1
            `;
            const query_patients = `
                SELECT patient_email FROM patients WHERE user_id = ? LIMIT 1
            `;
            const result_from_employees = await executeMySqlQuery(query_employees,[user_id]);
            const result_from_patients = await executeMySqlQuery(query_patients,[user_id]);

            if(result_from_employees.length > 0){
                return {user_email:result_from_employees[0]?.user_email, table:"employees"}; 
            }
            else if(result_from_patients.length > 0){
                return {user_email:result_from_patients[0]?.patient_emmail, table:"patients"}; 
            }
            } else {
                console.error("User's Id do not exist in db");
            return null;
        }
        }

        static async getUserTitleByID(user_id ){

            const query = `
                SELECT COALESCE(
                (SELECT emp_title FROM employees WHERE emp_id = ? LIMIT 1),
                'Patient'
            ) AS emp_title`;

            const result = await executeMySqlQuery(query,[user_id]);
            
            return result[0]?.emp_title; 
        
        }

        static async getUserTitleByEmail(user_email ){

            const query = `
                SELECT COALESCE(
                (SELECT emp_title FROM employees e JOIN users u ON u.user_id = e.emp_id WHERE u.user_email = ? LIMIT 1),
                'Patient'
            ) AS emp_title`;

            const result = await executeMySqlQuery(query,[user_email]);
            
            return result[0]?.emp_title; 
        
        }

        

    



    static async getUserRole(emp_id  ){
        //Finds Role of user using id or email & by default Role is Employee if not defined or user not exist
        if (!emp_id)  return console.error("No emp_id Provided to get Role");

            const query = `
                SELECT COALESCE(
                    (SELECT NULLIF(r.role_name, '') 
                    FROM roles r 
                    WHERE r.emp_id = ?
                    LIMIT 1),
                    'NormalUser'
                ) AS role_name;
            `;

            const result = await executeMySqlQuery(query,[emp_id]);

            return result[0]?.role_name; 

    }


    static async getSetUserperms(emp_id){
// 
        const query = `SELECT COALESCE((SELECT COALESCE(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', ') , 'None') FROM perms p JOIN employee_perms ep ON p.perm_id = ep.perm_id WHERE ep.emp_id =${emp_id}), 'None') AS perm_name `
        // [0] as result is in array form but perms field has a single value as string 
        const result = await executeMySqlQuery(query ,[emp_id]);
        const setOfPerms = result.length > 0 ?  new Set(result[0].perm_name.split(", ")) : new Set(result[0].perm_name.split(["None"]))
        
            return  setOfPerms;
        
    }

    // =============================
    //              Other Methods
    // =============================
    static async hashPassword(password){
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }





    

}


module.exports = User;