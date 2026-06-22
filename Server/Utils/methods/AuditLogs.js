const executeMySqlQuery = require("../executeMySqlQuery");

class AuditLogs {

    // ================================================
    // 1) Add a new audit log
    // ================================================
    static async addLog(site_id, modifier_id, method, affects_who) {
        const query = `
            INSERT INTO audit_logs (site_id, modifier_id, method, affects_who)
            VALUES (?, ?, ?, ?)
        `;
        const params = [site_id, modifier_id, method, JSON.stringify(affects_who)];
        return await executeMySqlQuery(query, params);
    }

    // ================================================
    // 2) Get logs by modifier_id and site_id
    // ================================================
    static async getLogsByModifier(site_id, modifier_id, limit = 50) {
        const query = `
            SELECT *
            FROM audit_logs
            WHERE site_id = ? AND modifier_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        `;
        return await executeMySqlQuery(query, [site_id, modifier_id, limit]);
    }

    // ================================================
    // 3) Get logs affecting a specific user on a site
    // ================================================
    static async getLogsAffectingUser(site_id, user_id, limit = 50) {
        const query = `
            SELECT *
            FROM audit_logs
            WHERE site_id = ? AND JSON_EXTRACT(affects_who, '$.user_id') = ?
            ORDER BY created_at DESC
            LIMIT ?
        `;
        return await executeMySqlQuery(query, [site_id, user_id, limit]);
    }

    // ================================================
    // 4) Get all logs for a site (with optional limit)
    // ================================================
    static async getAllLogs(site_id, limit = 100) {
        const query = `
            SELECT *
            FROM audit_logs
            WHERE site_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        `;
        return await executeMySqlQuery(query, [site_id, limit]);
    }

}

module.exports = AuditLogs;
