const CompanyUserFactory = require("./CompanyUserFactory");
const executeMySqlQuery = require("../../Utils/executeMySqlQuery");

/**
 * Simplified CompanyUsersMethods class that delegates to CompanyUserFactory
 * Keeps only methods that work across multiple user types
 */
class CompanyUsersMethods {
    
    // ========================================
    // Delegation to Factory Methods
    // ========================================
    
    /**
     * Check if a user title is a valid company user type

     */
    static isCompanyUser(user_title) {
        return CompanyUserFactory.isCompanyUser(user_title);
    }

    /**
     * Check if a user title is a valid hospital user type

     */
    static isHospitalUser(user_title) {
        return CompanyUserFactory.isHospitalUser(user_title);
    }

    /**
     * Get specific data for a user by title

     */
    static async MapUserToGETSpecificDataFunction(user_id, user_title) {
        return await CompanyUserFactory.getSpecificData(user_id, user_title);
    }

    /**
     * Get full data for a user by title

     */
    static async MapUserToGETFullDataFunction(user_id, user_title) {
        return await CompanyUserFactory.getFullData(user_id, user_title);
    }



    /**
     * Update user data (full/core update)

     */
    static async MapUserToFullUpdateFunction(user_id, title, updatingObj) {

        return await CompanyUserFactory.updateFullCore(user_id, title, updatingObj);
    }

    // ========================================
    // Cross-User-Type Methods
    // ========================================

    /**
     * Get count of all company employees with optional filters
     */
    static async getAllCompanyEmployeesCOUNT(filtering_string = null, emp_perms = null) { 
        const perms_CONDITION = emp_perms 
            ? `HAVING FIND_IN_SET('${emp_perms}', GROUP_CONCAT(DISTINCT p.perm_name)) > 0` 
            : "";

        const query = `
            SELECT COUNT(*) as total_count
            FROM (
                SELECT u.user_id
                FROM users u
                INNER JOIN employees e ON u.user_id = e.emp_id

                -- Permissions and roles
                LEFT JOIN employee_perms ep ON e.emp_id = ep.emp_id
                LEFT JOIN perms p ON ep.perm_id = p.perm_id
                LEFT JOIN roles r ON e.emp_id = r.emp_id

                WHERE u.user_type = 'employee'
                ${filtering_string ? "AND " + filtering_string : ""}

                GROUP BY u.user_id
                ${perms_CONDITION}
            ) as subquery;
        `;

        const COUNT = await executeMySqlQuery(query);
        return COUNT[0]?.total_count;
    }


    /**
     * Get all company employees with full data and optional filters
     */
  static async getAllCompanyEmployeesFullData(limit = 10, offset = 0, filtering_string = null, emp_perms = null) { 
    console.log("Getting all company employees with filters:", filtering_string, "and permissions:", emp_perms);
    const perms_CONDITION = emp_perms 
        ? `HAVING FIND_IN_SET('${emp_perms}', GROUP_CONCAT(DISTINCT p.perm_name)) > 0` 
        : "";

    const query = `
        SELECT 
            u.user_id,
            u.user_email,
            u.user_name,
            u.created_at,
            e.emp_abscence,
            e.emp_rate,
            e.emp_salary,
            e.emp_bonus,
            e.emp_title,
            e.emp_specialty,
            
            -- Use ANY_VALUE for non-aggregated columns from 1:1 relationships
            COALESCE(ANY_VALUE(d.initial_consultation_price), ANY_VALUE(s.initial_consultation_price)) AS initial_consultation_price,
            COALESCE(ANY_VALUE(d.followup_consultation_price), ANY_VALUE(s.followup_consultation_price)) AS followup_consultation_price,
            ANY_VALUE(s.surgery_price) AS surgery_price,
            COALESCE(ANY_VALUE(d.years_of_exp), ANY_VALUE(s.years_of_exp)) AS years_of_exp,
            ANY_VALUE(n.floor_number) AS floor_number,
            
            -- Permissions (aggregated)
            COALESCE(NULLIF(GROUP_CONCAT(DISTINCT p.perm_name SEPARATOR ', '), ''), 'None') AS emp_perms,
            
            -- Role (use ANY_VALUE since it's 1:1 with employee)
            COALESCE(ANY_VALUE(r.role_name), 'NormalUser') AS role_name

        FROM users u
        INNER JOIN employees e ON u.user_id = e.emp_id

        -- Title-specific joins
        LEFT JOIN doctors d ON d.emp_id = e.emp_id
        LEFT JOIN surgeons s ON s.emp_id = e.emp_id
        LEFT JOIN nurses n ON n.emp_id = e.emp_id

        -- Permissions and roles
        LEFT JOIN employee_perms ep ON e.emp_id = ep.emp_id
        LEFT JOIN perms p ON ep.perm_id = p.perm_id
        LEFT JOIN roles r ON e.emp_id = r.emp_id

        WHERE u.user_type = 'employee'
        ${filtering_string ? "AND " + filtering_string : ""}

        -- Minimal GROUP BY
        GROUP BY u.user_id, e.emp_id

        ${perms_CONDITION}
        ORDER BY u.user_id
        LIMIT ${limit} OFFSET ${offset}
    `;

    const result = await executeMySqlQuery(query);
    return result;
}


  



    // ========================================
    // Utility Methods
    // ========================================

    /**
     * Get all valid company employee titles

     */
    static getAllValidTitles() {
        return CompanyUserFactory.getAllValidTitles();
    }


}

module.exports = CompanyUsersMethods;