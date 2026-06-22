function createOrderByClause(orderByObj = {}) {
  if (!orderByObj || typeof orderByObj !== "object") return "";

  const orderParts = [];

  for (const [field, direction] of Object.entries(orderByObj)) {
    if (!direction) continue; // skip undefined/null

    const dir = direction.toLowerCase();

    if (dir === "htl") {
      orderParts.push(`${field} DESC`);
    } 
    else if (dir === "lth") {
      orderParts.push(`${field} ASC`);
    }
  }

  if (orderParts.length === 0) return "";

  return "ORDER BY " + orderParts.join(", ");
}

module.exports = createOrderByClause;