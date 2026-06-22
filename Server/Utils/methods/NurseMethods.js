const executeMySqlQuery = require("../executeMySqlQuery");
const Tables = require("../../Tables/data");
const stringifyFields = require("../stringifyFields");
const sqlTransaction = require("../sqlTransaction");
const parseUpdatingStringByTable = require("../parseUpdatingStringByTable");
const parsedUpdatesToObjects = require("../parsedUpdatesToObjects");
const generatePlaceholders = require("../generatePlaceholders")
const User = require("../../Classes/User");
class NurseMethods {



    // ============================
    //              COUNT
    // ============================
    static async getAllNursesCOUNT(whereClause = "", perms_CONDITION = ""){
    let query = "";
    // Optimize query construction based on presence of filters
    if(!whereClause && !perms_CONDITION){
        query = "SELECT COUNT(*) as count FROM nurses ";
    }
    else if(whereClause && !perms_CONDITION){
        query = `
            SELECT COUNT(DISTINCT n.emp_id) as count 
            FROM nurses n
            JOIN employees e ON n.hosp_emp_id = e.emp_id
            LEFT JOIN roles r ON n.hosp_emp_id = r.emp_id
            ${whereClause}
        `;
    }
    else if(!whereClause && perms_CONDITION){
        query = `
            SELECT COUNT(DISTINCT n.emp_id) as count 
            FROM nurses n
            JOIN employees e ON n.hosp_emp_id = e.emp_id
            LEFT JOIN employee_perms ep ON n.hosp_emp_id = ep.emp_id
            LEFT JOIN perms p ON ep.perm_id = p.perm_id
            ${perms_CONDITION}
        `;
    }
    else{
        query = `
            SELECT COUNT(DISTINCT n.emp_id) as count 
            FROM nurses n
            JOIN employees e ON n.hosp_emp_id = e.emp_id
            LEFT JOIN employee_perms ep ON n.hosp_emp_id = ep.emp_id
            LEFT JOIN perms p ON ep.perm_id = p.perm_id
            LEFT JOIN roles r ON n.hosp_emp_id = r.emp_id
            ${whereClause}
            ${perms_CONDITION}
        `;
    }
    const result = await executeMySqlQuery(query);
    return result[0]?.count;
}

    // ============================
    //              GET
    // ============================

    static async getAllNursesFullData(limit=10,offset=0,whereClause='', perms_CONDITION=''){
        
        const query = `
        SELECT 
            -- from users
            u.user_id,
            u.user_email,
            u.user_name,
            
            -- from employees
            e.emp_abscence,
            e.emp_rate,
            e.emp_title,
            e.emp_specialty,
            e.emp_salary,
            e.emp_bonus,
            
            -- from employees_hospital
            eh.hosp_emp_id,
            
            -- from nurses (may be NULL)
            ANY_VALUE(n.emp_id) AS emp_id,
            ANY_VALUE(n.floor_number) AS floor_number,
            
            -- from perms via employee_perms
            COALESCE(NULLIF(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', '), ''), 'None') AS emp_perms,
            
            -- from roles with COALESCE for default
            COALESCE(ANY_VALUE(r.role_name), 'NormalUser') AS role_name,
            
            -- FIXED: availability schedule using subquery to format times first
            COALESCE((
                SELECT GROUP_CONCAT(
                    DISTINCT CONCAT(
                        formatted.day_of_week, 
                        ': ', 
                        formatted.formatted_start, 
                        '-', 
                        formatted.formatted_end
                    )
                    ORDER BY formatted.day_of_week
                    SEPARATOR '; '
                )
                FROM (
                    SELECT 
                        day_of_week,
                        DATE_FORMAT(start_time, '%H:%i') as formatted_start,
                        DATE_FORMAT(end_time, '%H:%i') as formatted_end
                    FROM availability 
                    WHERE hosp_emp_id = eh.hosp_emp_id
                ) AS formatted
            ), 'None') AS availability_schedule

        FROM users u
        INNER JOIN employees e ON u.user_id = e.emp_id
        INNER JOIN employees_hospital eh ON e.emp_id = eh.emp_id
        
        -- LEFT JOIN for optional nurse data
        LEFT JOIN nurses n ON eh.hosp_emp_id = n.hosp_emp_id

        -- LEFT JOIN for permissions and roles
        LEFT JOIN employee_perms ep ON eh.hosp_emp_id = ep.emp_id
        LEFT JOIN perms p ON ep.perm_id = p.perm_id
        LEFT JOIN roles r ON eh.hosp_emp_id = r.emp_id

        WHERE u.user_type = 'employee'
        AND eh.emp_title = 'Nurse'
        ${whereClause} 

        GROUP BY u.user_id, eh.hosp_emp_id, e.emp_id
        ${perms_CONDITION}
        LIMIT ${limit} OFFSET ${offset}
    `;

    const result = await executeMySqlQuery(query);
    return result;
    }

    static async getNurseFullData(emp_id){
         const query = `
        SELECT 
            -- from users
            u.user_id,
            u.user_email,
            u.user_name,

            -- from employees
            e.emp_abscence,
            e.emp_rate,
            e.emp_title,
            e.emp_specialty,
            e.emp_salary,
            e.emp_bonus,
            
            -- from employees_hospital
            eh.hosp_emp_id,
            
            -- from nurses (may be NULL)
            n.emp_id,
            n.floor_number,
            
            -- from perms via employee_perms (subquery)
            COALESCE(NULLIF((
                SELECT GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', ')
                FROM employee_perms ep
                JOIN perms p ON ep.perm_id = p.perm_id
                WHERE ep.emp_id = eh.hosp_emp_id
            ), ''), 'None') AS emp_perms,
            
            -- from roles with COALESCE for default (subquery)
            COALESCE((
                SELECT r.role_name
                FROM roles r
                WHERE r.emp_id = eh.hosp_emp_id
            ), 'NormalUser') AS role_name,
            
            -- FIXED: availability schedule using subquery to format times first
            COALESCE((
                SELECT GROUP_CONCAT(
                    DISTINCT CONCAT(
                        formatted.day_of_week, 
                        ': ', 
                        formatted.formatted_start, 
                        '-', 
                        formatted.formatted_end
                    )
                    ORDER BY formatted.day_of_week
                    SEPARATOR '; '
                )
                FROM (
                    SELECT 
                        day_of_week,
                        DATE_FORMAT(start_time, '%H:%i') as formatted_start,
                        DATE_FORMAT(end_time, '%H:%i') as formatted_end
                    FROM availability 
                    WHERE hosp_emp_id = eh.hosp_emp_id
                ) AS formatted
            ), 'None') AS availability_schedule

        FROM users u
        INNER JOIN employees e ON u.user_id = e.emp_id
        INNER JOIN employees_hospital eh ON e.emp_id = eh.emp_id
        
        -- LEFT JOIN for optional nurse data
        LEFT JOIN nurses n ON eh.hosp_emp_id = n.hosp_emp_id
        
        WHERE u.user_type = 'employee'
        AND eh.hosp_emp_id = ?
        AND eh.emp_title = 'Nurse'
    `;

    const result = await executeMySqlQuery(query, [emp_id]);
    return result[0];
    }

        static async getAllNursesSpecificData(){
        const query = `
        SELECT 
            -- from users
            u.user_id,
            u.user_email,
            u.user_name,

            -- from employees
            e.emp_abscence,
            e.emp_rate,
            e.emp_title,
            e.emp_specialty,
            e.emp_salary,
            e.emp_bonus,
            
            -- from employees_hospital
            eh.hosp_emp_id,
            
            -- from nurses (may be NULL)
            n.floor_number,
            
            -- FIXED: availability schedule using subquery to format times first
            COALESCE((
                SELECT GROUP_CONCAT(
                    DISTINCT CONCAT(
                        formatted.day_of_week, 
                        ': ', 
                        formatted.formatted_start, 
                        '-', 
                        formatted.formatted_end
                    )
                    ORDER BY formatted.day_of_week
                    SEPARATOR '; '
                )
                FROM (
                    SELECT 
                        day_of_week,
                        DATE_FORMAT(start_time, '%H:%i') as formatted_start,
                        DATE_FORMAT(end_time, '%H:%i') as formatted_end
                    FROM availability 
                    WHERE hosp_emp_id = eh.hosp_emp_id
                ) AS formatted
            ), 'None') AS availability_schedule

        FROM users u
        INNER JOIN employees e ON u.user_id = e.emp_id
        INNER JOIN employees_hospital eh ON e.emp_id = eh.emp_id
        
        -- LEFT JOIN for optional nurse data
        LEFT JOIN nurses n ON eh.hosp_emp_id = n.hosp_emp_id
        
        WHERE u.user_type = 'employee'
        AND eh.emp_title = 'Nurse'
    `;
    
    const result = await executeMySqlQuery(query);
    return result;
    }

    static async getNurseSpecificData(emp_id){
        const query = `
        SELECT 
            -- from users
            u.user_id,
            u.user_email,
            u.user_password,
            u.user_name,

            -- from employees
            e.emp_salary,
            e.emp_abscence,
            e.emp_bonus,
            e.emp_rate,
            e.emp_title,
            e.emp_specialty,

            -- from employees_hospital
            eh.hosp_emp_id,
            
            -- from nurses (may be NULL)
            n.floor_number,
            
            -- FIXED: availability schedule using subquery to format times first
            COALESCE((
                SELECT GROUP_CONCAT(
                    DISTINCT CONCAT(
                        formatted.day_of_week, 
                        ': ', 
                        formatted.formatted_start, 
                        '-', 
                        formatted.formatted_end
                    )
                    ORDER BY formatted.day_of_week
                    SEPARATOR '; '
                )
                FROM (
                    SELECT 
                        day_of_week,
                        DATE_FORMAT(start_time, '%H:%i') as formatted_start,
                        DATE_FORMAT(end_time, '%H:%i') as formatted_end
                    FROM availability 
                    WHERE hosp_emp_id = eh.hosp_emp_id
                ) AS formatted
            ), 'None') AS availability_schedule

        FROM users u
        INNER JOIN employees e ON u.user_id = e.emp_id
        INNER JOIN employees_hospital eh ON e.emp_id = eh.emp_id
        
        -- LEFT JOIN for optional nurse data
        LEFT JOIN nurses n ON eh.hosp_emp_id = n.hosp_emp_id
        
        WHERE u.user_type = 'employee'
        AND eh.hosp_emp_id = ?
        AND eh.emp_title = 'Nurse'
    `;
    
    const result = await executeMySqlQuery(query, [emp_id]);
    return result[0];
    }
    // ============================
    //              Update
    // ============================

    // Updated updateNurseFullCore function
static async updateNurseFullCore(emp_id, updatingObj){

    // parsedUpdates = {
        //   users: { sql: "user_name = ?, user_email = ?", values: ["Ali", "a@b.com"] },
        //   employees: { sql: "emp_salary = ?", values: [5000] }
        // }
        const parsedUpdates = parseUpdatingStringByTable(updatingObj);
        // parsedObjects = {
        //   users: { user_name: "Ali", user_email: "a@b.com" },
        //   employees: { emp_salary: 5000 }
        // }
        const parsedObjects = parsedUpdatesToObjects(parsedUpdates);
        const queries = [];
        const params = []


    // 1. Ensure user exists
    if (parsedUpdates.users) {
        queries.push(`
            UPDATE users
            SET ${parsedUpdates.users.sql}
            WHERE user_id = ? AND user_type = 'employee'
        `);
        params.push([...parsedUpdates.users.values, emp_id])
    }

    // 2. UPSERT employees
    if (parsedUpdates.employees) {
        const { columns_field } = stringifyFields(
                "seperate",
                Object.entries(parsedObjects.employees) || {}
            );

            const placeholders = generatePlaceholders(columns_field.split(',').length);

            queries.push(`
                INSERT INTO employees (emp_id,${columns_field})
                VALUES (?,${placeholders})
                ON DUPLICATE KEY UPDATE
                    ${parsedUpdates.employees.sql}
            `);
            // ✅ CORRECT
            // id, insert values , update values
            params.push([emp_id, ...parsedUpdates.employees.values, ...parsedUpdates.employees.values ]);
            console.log(params)
    }
    
    // 3. UPSERT nurses table (has defaults via hosp_emp_id, can insert)
    if (parsedUpdates.nurses) {
        const {columns_field} = stringifyFields("seperate",Object.entries(parsedObjects.nurses) || {});
        const placeholders = generatePlaceholders(columns_field.split(',').length);

        queries.push(`
            INSERT INTO nurses (emp_id, hosp_emp_id,${columns_field})
            SELECT
                ?,
                ?,
                ${placeholders}
            FROM employees e
            JOIN users u
                ON u.user_type = 'employee' AND u.user_id = e.emp_id
            WHERE e.emp_id = ?
            ON DUPLICATE KEY UPDATE
                ${parsedUpdates.nurses.sql}
        `);
        // emp_id, hosp_emp_id, insert_values, emp_id, update_values
        params.push([emp_id,emp_id  , ...parsedUpdates.nurses.values ,emp_id, ...parsedUpdates.nurses.values ])
        console.log(params)
    }
    
    // 4. Version update
    // 4. Version update
    queries.push(`
       INSERT INTO table_version (table_name, current_version)
        VALUES ('ems_employees', 1)
        ON DUPLICATE KEY UPDATE
        current_version = current_version + 1'
    `);
    // it's related to hospital, so we need to keep hospital's website synced
    queries.push(`
       INSERT INTO table_version (table_name, current_version)
        VALUES ('hospital_employees', 1)
        ON DUPLICATE KEY UPDATE
        current_version = current_version + 1'
    `);
    
    const result = await sqlTransaction(queries, params);
    
    // Check if user update affected any rows (to know if user exists)
    if (parsedUpdates.users && !result) {
        throw new Error('User not found. Please register the user first.');
    }
    
    return result;
}



}

module.exports = NurseMethods;