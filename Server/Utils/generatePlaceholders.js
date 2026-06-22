/**
 * Generate SQL placeholders for parameterized queries
 * @param {number} count - Number of placeholders needed
 * @returns {string} - Comma-separated placeholders: "?, ?, ?"
 * 
 * @example
 * generatePlaceholders(3) // Returns: "?, ?, ?"
 * generatePlaceholders(1) // Returns: "?"
 * generatePlaceholders(0) // Returns: ""
 */
function generatePlaceholders(count) {
    if (!count || count <= 0) {
        return '';
    }
    
    return Array(count).fill('?').join(', ');
}

module.exports = generatePlaceholders;