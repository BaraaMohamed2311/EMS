
const DefaultEmployeeMethods = require("../../Utils/methods/DefaultEmployeeMethods");
const NurseMethods = require("../../Utils/methods/NurseMethods");
const DoctorMethods = require("../../Utils/methods/DoctorMethods");
const SurgeonMethods = require("../../Utils/methods/SurgeonMethods");
/**
 * Factory class for mapping company employee titles to their respective method classes
 * Centralizes all employee-type-specific operations
 */
class CompanyUserFactory {
    static #company_users = new Set([
        "ceo",
        "cloud engineer",
        "designer",
        "developer",
        "devops engineer",
        "doctor",
        "engineer",
        "hr",
        "intern",
        "nurse",
        "scientist",
        "surgeon",
        "manager",
        "salesperson",
        "marketer",
        "default", // catch-all for unknown titles
    ]);

    // ========================================
    // Method Class Mapping
    // ========================================
    static #methodClassMap = {
        "Doctor": DoctorMethods,
        "Surgeon": SurgeonMethods,
        "Nurse": NurseMethods,
        "default": DefaultEmployeeMethods,
    };

    // ========================================
    // Specific Data Methods
    // ========================================
    static #specificDataMethods = {
        "Doctor": DoctorMethods.getDoctorSpecificData,
        "Surgeon": SurgeonMethods.getSurgeonSpecificData,
        "Nurse": NurseMethods.getNurseSpecificData,
        "default": DefaultEmployeeMethods.getDefaultEmployeeSpecificData,
    };

    // ========================================
    // Full Data Methods
    // ========================================
    static #fullDataMethods = {
        "Doctor": DoctorMethods.getDoctorFullData,
        "Surgeon": SurgeonMethods.getSurgeonFullData,
        "Nurse": NurseMethods.getNurseFullData,
        "default": DefaultEmployeeMethods.getDefaultEmployeeFullData,
    };

    // ========================================
    // All Full Data Methods (with pagination)
    // ========================================
    static #allFullDataMethods = {
        "Doctor": DoctorMethods.getAllDoctorsFullData,
        "Surgeon": SurgeonMethods.getAllSurgeonsFullData,
        "Nurse": NurseMethods.getAllNursesFullData,
        "default": DefaultEmployeeMethods.getAllDefaultEmployeesFullData,
    };

    // ========================================
    // Count Methods
    // ========================================
    static #countMethods = {
        
        "default": DefaultEmployeeMethods.getAllDefaultEmployeesCOUNT,
    };


    // ========================================
    // Update Methods (Full/Core)
    // ========================================
    static #fullUpdateMethods = {
        "Doctor": DoctorMethods.updateDoctorFullCore,
        "Surgeon": SurgeonMethods.updateSurgeonFullCore,
        "Nurse": NurseMethods.updateNurseFullCore,
        "default": DefaultEmployeeMethods.updateDefaultEmployeeFullCore,
    };

    // ========================================
    // Validation Methods
    // ========================================
    
    /**
     * Check if a user title is a valid company user type

     */
    static isCompanyUser(user_title) {
        if (!user_title) return false;
        return this.#company_users.has(user_title.toLowerCase());
    }

    /**
     * Check if a user title is a valid hospital user type

     */
    static isHospitalUser(user_title) {
        if (!user_title) return false;
        return this.#company_users.has(user_title.toLowerCase());
    }

    /**
     * Get user title or return default if not found
     */
    static #normalizeUserTitle(user_title) {
        if (!user_title) return "default";
        
        // Check if title exists in map
        if (this.#methodClassMap[user_title]) {
            return user_title;
        }
        
        // Log unknown title for monitoring
        console.warn(`Unknown user title: "${user_title}". Using default handler.`);
        return "default";
    }

    /**
     * Validate user title (removed - now we normalize instead)
     */
    static #validateUserTitle(user_title) {
        // This method is no longer needed but kept for backward compatibility
        return this.#normalizeUserTitle(user_title);
    }


    // ========================================
    // Get Method Class
    // ========================================
    
    /**
     * Get the method class for a specific user title

     */
    static getMethodClass(user_title) {
        this.#validateUserTitle(user_title);
        return this.#methodClassMap[user_title];
    }

    // ========================================
    // Execute Methods by Title
    // ========================================

    /**
 * Get specific data for a user
 */
static async getSpecificData(user_id, user_title) {
    const normalizedTitle = this.#normalizeUserTitle(user_title);
    const method = this.#specificDataMethods[normalizedTitle];

    if (!method || typeof method !== "function") return {}; // default empty object
    try {
        return (await method.call(this.#methodClassMap[user_title], user_id)) || {};
    } catch (err) {
        console.error(`Error in getSpecificData for ${user_title}:`, err);
        return {};
    }
}

    /**
     * Get full data for a user
     */
    static async getFullData(user_id, user_title) {

        const normalizedTitle = this.#normalizeUserTitle(user_title);
        const method = this.#fullDataMethods[normalizedTitle];

        if (!method || typeof method !== "function") return {}; // default empty object
        try {
            return (await method.call(this.#methodClassMap[user_title], user_id)) || {};
        } catch (err) {
            console.error(`Error in getFullData for ${user_title}:`, err);
            return {};
        }
    }

    /**
     * Get all users of a type (with pagination)
     */
    static async getAllFullData(user_title, limit = 10, offset = 0, whereClause = '', perms_CONDITION = '') {
        const normalizedTitle = this.#normalizeUserTitle(user_title);
        const method = this.#allFullDataMethods[normalizedTitle];
        if (!method || typeof method !== "function") return []; // default empty array
        try {
            return (await method.call(this.#methodClassMap[user_title], limit, offset, whereClause, perms_CONDITION)) || [];
        } catch (err) {
            console.error(`Error in getAllFullData for ${user_title}:`, err);
            return [];
        }
    }

    /**
     * Get count of all users of a type

     */
    static async getCount(user_title, whereClause = '', perms_CONDITION = '') {
        const normalizedTitle = this.#normalizeUserTitle(user_title);
        const method = this.#countMethods[normalizedTitle];
        if (!method) return 0;
        return await method.call(this.#methodClassMap[user_title], whereClause, perms_CONDITION);
    }

    /**
     * Update user data (partial update)

     */
    static async updateData(user_id, user_title, data, actions) {
        const normalizedTitle = this.#normalizeUserTitle(user_title);
        const method = this.#fullUpdateMethods[normalizedTitle];
        if (!method) return false;
        return await method.call(this.#methodClassMap[user_title], user_id, data, actions);
    }

    /**
     * Update user data (full/core update)

     */
    static async updateFullCore(user_id, user_title, updatingObj) {
        const normalizedTitle = this.#normalizeUserTitle(user_title);
        const method = this.#fullUpdateMethods[normalizedTitle];
        if (!method) return false;
        return await method.call(this.#methodClassMap[user_title], user_id, updatingObj);
    }

    // ========================================
    // Utility Methods
    // ========================================

    /**
     * Get all valid company user titles
     * @returns {Array<string>}
     */
    static getAllValidTitles() {
        return Object.keys(this.#methodClassMap);
    }
    /**
     * Check if a method exists for a user title

     */
    static hasMethod(user_title, methodType) {
        const maps = {
            'specific': this.#specificDataMethods,
            'full': this.#fullDataMethods,
            'count': this.#countMethods,
            'fullUpdate': this.#fullUpdateMethods
        };
        const map = maps[methodType];
        return map ? !!map[user_title] : false;
    }
}

module.exports = CompanyUserFactory;