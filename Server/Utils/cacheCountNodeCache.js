const NodeCache = require("node-cache");
// called in module scope to ensure same instance is used for all function calls
const myCache = new NodeCache({ stdTTL: 3600 }); // 1 hour default TTL

async function cacheCountNodeCache(key,queryFN,whereClause,isFiltered=false,CACHE_TTL=600){

    if(!key ) return console.error("Key has to be provided to cacheCountNodeCache");
    if(!queryFN ) return console.error("queryFN has to be provided to cacheCountNodeCache")

    let cachedCount;


// =====================================
// Use cached count for NON-FILTERED queries
// =====================================
if (!isFiltered) {

    // If cached → use cached value (NO DB HIT)
    if (myCache.has(key)) {
        cachedCount = myCache.get(key);
    } else {
        // Cache does not exist → NOW run DB query
        
        cachedCount = await queryFN(whereClause);;

        // store in cache
        myCache.set(key, cachedCount, CACHE_TTL);
    }

} else {

    // =====================================
    // Filtered queries ALWAYS use fresh count
    // =====================================

    cachedCount = await queryFN(whereClause);

}


return cachedCount || 1

}

module.exports = cacheCountNodeCache;