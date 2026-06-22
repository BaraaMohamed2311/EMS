import { openIndxDB } from "./openIndxDB.js";
// ===================================
//        Update Data inside indexDB
// ===================================

export async function putIndexDB(storeName, newDataArray) {

  if (!Array.isArray(newDataArray)) {
    throw new Error("appendToIndexDB expects an array of objects");
  }

  const db = await openIndxDB();

  newDataArray = newDataArray.map(obj => ({
  ...obj,
  user_id: Number(obj.user_id)   // or String(), but stick to one
}));

      

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    // use put to add or update records (if key exists, it updates), to prevent duplicates
      newDataArray.forEach((obj) => {

        store.put(obj);
      })

      transaction.oncomplete = () => {
        resolve(true);
      };

      transaction.onerror = () => {
        console.error(` Failed to append to ${storeName}:`, transaction.error);
        reject(transaction.error);
      }

  });
}



// ===================================
//     Update specific record by prop
// ===================================
export async function updateRecordByProp(storeName, lookupProp, lookupValue, updatedFields) {
  const db = await openIndxDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    // Step 1: Open cursor to find the record by property
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const record = cursor.value;

        // Check if this is the record we want to update
        if (record[lookupProp] === lookupValue) {
          const updatedRecord = {
            ...record,
            ...updatedFields, // merge updates
          };

          cursor.update(updatedRecord);

          return; // continue transaction
        }

        cursor.continue(); // keep searching
      }
    };

    transaction.oncomplete = () => {
      resolve(true);
    };

    transaction.onerror = () => {
      console.error(`❌ Failed updating record in ${storeName}`, transaction.error);
      reject(transaction.error);
    };
  });
}

