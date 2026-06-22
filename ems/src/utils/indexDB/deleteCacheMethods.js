import { openIndxDB } from "./openIndxDB.js";
// ===================================
//        DELETE By Id 
// ===================================

export async function deleteRecordById(storeName, id) {
  const db = await openIndxDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
// ===================================
//        DELETE By Id 
// ===================================
export async function clearStore(storeName) {
  const db = await openIndxDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// ===================================
//        DELETE AFTER 1 HOUR
// ===================================

export async function deleteAfterOneHour(storeNames) {
  const STORAGE_KEY = 'indexeddb_clear_timestamp';
  const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds
  
  try {
    const now = Date.now();
    const storedTimestamp = localStorage.getItem(STORAGE_KEY);
    
    // If no timestamp exists or 1 hour has passed, clear the stores
    if (!storedTimestamp || (now - parseInt(storedTimestamp)) >= ONE_HOUR_MS) {
      console.warn('Clearing IndexedDB stores after 1 hour...');
      
      // Clear all specified stores
      for (const storeName of storeNames) {
        await clearStore(storeName);
      }
      
      // Update the timestamp
      localStorage.setItem(STORAGE_KEY, now.toString());
      return true;
    }
    
    return false; // No clearance needed yet
  } catch (error) {
    console.error('Error in deleteAfterOneHour:', error);
    return false;
  }
}