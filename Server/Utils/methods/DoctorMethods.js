const executeMySqlQuery = require("../executeMySqlQuery");
const sqlTransaction = require("../sqlTransaction")
const Tables = require("../../Tables/data");
const stringifyFields = require("../stringifyFields");
const parseUpdatingStringByTable = require("../parseUpdatingStringByTable");
const parsedUpdatesToObjects = require("../parsedUpdatesToObjects");
const generatePlaceholders = require("../generatePlaceholders")

class DoctorMethods {


    // ============================
    //              Count
    // ============================

    static async getAllDoctorsCOUNT(filtering_string = "", perms_CONDITION = ""){

        let query = "";
        // Optimize query construction based on presence of filters
        if(!filtering_string && !perms_CONDITION){
                query = "SELECT COUNT(*) as count FROM doctors ";
            }
        else if(filtering_string && !perms_CONDITION){
                    query = `
                SELECT COUNT(DISTINCT d.emp_id) as count 
                FROM doctors d
                JOIN employees e ON d.hosp_emp_id = e.emp_id
                LEFT JOIN roles r ON d.hosp_emp_id = r.emp_id
                ${filtering_string ? " AND " + filtering_string : ""}
            `;
        }
        else if(!filtering_string && perms_CONDITION){
            query = `
                SELECT COUNT(DISTINCT d.emp_id) as count 
                FROM doctors d
                JOIN employees e ON d.hosp_emp_id = e.emp_id
                LEFT JOIN employee_perms ep ON d.hosp_emp_id = ep.emp_id
                LEFT JOIN perms p ON ep.perm_id = p.perm_id
                ${perms_CONDITION}
            `;
        
        }
        else{
            query = `
                SELECT COUNT(DISTINCT d.emp_id) as count 
                FROM doctors d
                JOIN employees e ON d.hosp_emp_id = e.emp_id
                LEFT JOIN employee_perms ep ON d.hosp_emp_id = ep.emp_id
                LEFT JOIN perms p ON ep.perm_id = p.perm_id
                LEFT JOIN roles r ON d.hosp_emp_id = r.emp_id
                ${filtering_string ? " AND " + filtering_string : ""}
                ${perms_CONDITION}
            `;
        }
        const result = await executeMySqlQuery(query);
        return result[0]?.count;
    }

    // ============================
    //              GET
    // ============================

    

        static async getAllDoctorsFullData(limit=10,offset=0,whereClause='', perms_CONDITION=''){

        
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
            
            -- from doctors (may be NULL)
            ANY_VALUE(d.emp_id) AS emp_id,
            ANY_VALUE(d.initial_consultation_price) AS initial_consultation_price,
            ANY_VALUE(d.followup_consultation_price) AS followup_consultation_price,
            ANY_VALUE(d.years_of_exp) AS years_of_exp,
            
            -- from perms via employee_perms
            COALESCE(NULLIF(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', '), ''), 'None') AS emp_perms,
            
            -- from roles with COALESCE for default
            COALESCE(ANY_VALUE(r.role_name), 'NormalUser') AS role_name,
            
            -- FIXED: Format availability schedule to remove seconds and use DISTINCT to avoid duplicates
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
        
        -- LEFT JOIN for optional doctor data
        LEFT JOIN doctors d ON eh.hosp_emp_id = d.hosp_emp_id

        -- LEFT JOIN for permissions and roles
        LEFT JOIN employee_perms ep ON eh.hosp_emp_id = ep.emp_id
        LEFT JOIN perms p ON ep.perm_id = p.perm_id
        LEFT JOIN roles r ON eh.hosp_emp_id = r.emp_id

        WHERE u.user_type = 'employee' 
        AND eh.emp_title = 'Doctor'
        ${whereClause} 

        GROUP BY u.user_id, eh.hosp_emp_id, e.emp_id
        ${perms_CONDITION}
        LIMIT ${limit} OFFSET ${offset}
    `;

        const result = await executeMySqlQuery(query);
        
        return result;
    }


     static async getDoctorFullData(emp_id){

        
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
            
            -- from doctors (may be NULL)
            d.emp_id,
            d.initial_consultation_price,
            d.followup_consultation_price,
            d.years_of_exp,
            
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
        
        -- LEFT JOIN for optional doctor data
        LEFT JOIN doctors d ON eh.hosp_emp_id = d.hosp_emp_id
        
        WHERE u.user_type = 'employee' 
        AND eh.hosp_emp_id = ?
        AND eh.emp_title = 'Doctor'
    `;
        
        const result = await executeMySqlQuery(query,[emp_id]);

        return result[0];
    }

    // =============================================
    //  No Roles Or Perms are fetched in Specific queries
    // =============================================


    static async getAllDoctorsSpecificData(){
        
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
            
            -- from doctors (may be NULL)
            d.initial_consultation_price,
            d.followup_consultation_price,
            d.years_of_exp,

            -- availability schedule (subquery)
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
        
        -- LEFT JOIN for optional doctor data
        LEFT JOIN doctors d ON eh.hosp_emp_id = d.hosp_emp_id
        
        WHERE u.user_type = 'employee'
        AND eh.emp_title = 'Doctor'
    `;
    
    const result = await executeMySqlQuery(query);
    return result[0];
    }

    static async getDoctorSpecificData(emp_id){
        
       const query = `
        SELECT 
            -- from users
            u.user_id,
            u.user_email,
            u.user_password,
            u.user_name,
            
            -- from employees
            e.emp_salary,
            e.emp_bonus,
            e.emp_abscence,
            e.emp_rate,
            e.emp_title,
            e.emp_specialty,
            
            -- from employees_hospital
            eh.hosp_emp_id,
            
            -- from doctors (may be NULL)
            d.emp_id,
            d.initial_consultation_price,
            d.followup_consultation_price,
            d.years_of_exp,

            -- availability schedule (subquery)
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
        
        -- LEFT JOIN for optional doctor data
        LEFT JOIN doctors d ON eh.hosp_emp_id = d.hosp_emp_id
        
        WHERE u.user_type = 'employee'
        AND eh.hosp_emp_id = ?
        AND eh.emp_title = 'Doctor'
    `;
    
    const result = await executeMySqlQuery(query, [emp_id]);
    return result[0];
    }

    


    // ============================
    //              Update
    // ============================

    static async updateDoctorFullCore(emp_id, updatingObj) {
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
    }

    // 3. UPSERT doctors
    if (parsedUpdates.doctors) {
        const { columns_field } = stringifyFields(
            "seperate",
            Object.entries(parsedObjects.doctors) || {}
        );

        const placeholders = generatePlaceholders(columns_field.split(',').length);
        queries.push(`
            INSERT INTO doctors (emp_id, hosp_emp_id,${columns_field})
            SELECT
                ?,
                ?,
                ${placeholders}
            FROM employees e
            JOIN users u
                ON u.user_type = 'employee' AND u.user_id = e.emp_id
            WHERE e.emp_id = ?
            ON DUPLICATE KEY UPDATE
                ${parsedUpdates.doctors.sql}
        `);
        // emp_id, hosp_emp_id, insert_values, emp_id, update_values
        params.push([emp_id,emp_id  , ...parsedUpdates.doctors.values ,emp_id, ...parsedUpdates.doctors.values ])
    }

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

    const result = await sqlTransaction(queries,params);

    // Check if user update affected any rows (to know if user exists)
    if (parsedUpdates.users && !result) {
        throw new Error('User not found. Please register the user first.');
    }
    
    return result;
}


        // No Need to use insertingObject here, as specific fields are only staff_id, user_id, relation_type
        static async updateDoctorPatient(emp_id, user_id, data ) {
            try{
                // ===1. Filter data to only include fields relevant to doctor_patient table
                const staff_patient_table_fields = Tables.staff_patient;
                const MapOfData = new Map(Object.entries(data));
                let fieldsToUpdate = {};
                for (const field of staff_patient_table_fields) {
                    if( MapOfData.has(field)){
                        fieldsToUpdate[field] = MapOfData.get(field);
                    }
                }
                // ===2.  Construct dynamic fields string for SQL
                const fields = stringifyFields( "joined",Object.entries(fieldsToUpdate))

                    const query = `
                        INSERT INTO staff_patient (staff_id, user_id, relation_type)
                        VALUES (${emp_id}, ${user_id}, 'Doctor')
                        ON DUPLICATE KEY UPDATE
                        ${fields};
                        `;


                    const version_query = `UPDATE table_version
                            SET current_version = current_version + 1
                            WHERE table_name = 'patients';
                            `


                    return await sqlTransaction([query, version_query]);

            }
            catch(err){
                console.error("Error updating doctor-patient data:", err);
                return false;
            }
        
            }



        static async replaceDoctorAvailability(emp_id, data ) {
            // ===0. Extract days, start_time, end_time from array of availability it has a format of 'Monday: 09:00:00-13:00:00; Wednesday: 14:00:00-18:00:00'
            const shifts = data.availability_schedule.split("; ")
            const availabilities = [];
            const seenDuplicateDay = new Set();
            shifts.forEach((shift) => {
                const [day_of_week, time] = shift.split(": ");
                const [start_time, end_time] = time.split("-");
                // Check for repition
                if (!seenDuplicateDay.has(day_of_week)) {
                    availabilities.push({ day_of_week, start_time, end_time });
                    seenDuplicateDay.add(day_of_week);
                }
            });

            const queries = [];
            // ===1. Delete Old Availabilities
            queries.push(`DELETE FROM availability WHERE hosp_emp_id = ${emp_id}`);

            // ===2. Insert New Ones 
            for (const availability of availabilities) {
                queries.push(`
                INSERT INTO availability (hosp_emp_id, day_of_week,start_time,end_time)
                VALUES (${emp_id},'${availability.day_of_week}','${availability.start_time}','${availability.end_time}')
                `);
            }

            return await sqlTransaction(queries); 
            }


   

}

module.exports = DoctorMethods;