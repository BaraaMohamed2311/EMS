

function JoinFiltering(entries, db) {
  // Filter out null/undefined/"null" values first
  const filtered = entries.filter(
    ([, value]) => value !== undefined && value !== null && value !== "null" && value !== ""
  );

  // Map into SQL conditions
  const conditions = filtered.map(([key, value]) => {
    const prefix = db ? `${db}.` : ""; // only prefix if db is provided

    if (typeof value === "string") {
      return `${prefix}${key} = "${value.replace(/"/g, '\\"')}"`; // escape quotes
    }
    return `${prefix}${key} = ${value}`;
  });

  // Join with AND
  return conditions.join(" AND ");
}





module.exports = JoinFiltering;