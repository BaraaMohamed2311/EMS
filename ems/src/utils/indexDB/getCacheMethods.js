import { openIndxDB } from "./openIndxDB.js";
// ===================================
//        GET All FROM STORE
// ===================================

export async function getAllFromStore(storeName) {
  const db = await openIndxDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      console.error(`Failed to retrieve data from ${storeName}`);
      reject(request.error);
    };
  });
}
// ===================================
//        GET By Id 
// ===================================
export async function getRecordById(storeName, id) {
  const db = await openIndxDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// ===================================
//        GET By Field
// ===================================

export async function getRecordByField(storeName, field, value) {
  const db = await openIndxDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.openCursor();
    let result = null;

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value[field] === value) {
          result = cursor.value;
          resolve(result);
          return; // stop once found
        }
        cursor.continue();
      } else {
        resolve(result); // null if not found
      }
    };

    request.onerror = () => reject(request.error);
  });
}