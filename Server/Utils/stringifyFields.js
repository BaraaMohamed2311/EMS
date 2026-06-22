function stringifyFields(isFor, entries, alias = "") {
  const prefix = alias ? `${alias}.` : ""; // Apply alias only if provided

  switch (isFor) {

    // ===========================================
    // 1. "seperate" —  (no alias usage)
    // ===========================================
    case "seperate":
      let columns_field = "";
      let values_field = "";

      entries.forEach(([key, value], indx) => {
        columns_field += key;

        if (typeof value === "string") {
          values_field += `"${value.replace(/"/g, '\\"')}"`;
        } else {
          values_field += `${value}`;
        }

        if (indx !== entries.length - 1) {
          columns_field += ",";
          values_field += ",";
        }
      });

      return { columns_field, values_field };

    // ===========================================
    // 2. "joined" — now alias-aware
    //    Produces:   alias.col = value , alias.col2 = value2
    // ===========================================
    case "joined":
      return entries
        .map(([key, value]) => {
          const field = `${prefix}${key}`;

          if (typeof value === "string") {
            return `${field} = "${value.replace(/"/g, '\\"')}"`;
          }
          return `${field} = ${value}`;
        })
        .join(", ");

    // ===========================================
    // 3. "fields" — now alias-aware
    //    Produces:   alias.col1 , alias.col2 , alias.col3
    // ===========================================
    case "fields":
      return entries
        .map(([field]) => `${prefix}${field}`)
        .join(", ");

    default:
      return "";
  }
}

module.exports = stringifyFields;
