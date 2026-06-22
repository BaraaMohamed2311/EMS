import {global_store_names} from "@/global_data"

// Database name and version
const DB_NAME = "ems";
const DB_VERSION = 1;

// Object store names
const STORES = global_store_names;

// ============================
//  OPEN or CREATE DATABASE
// ============================
export function openIndxDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Triggered if DB version changes or DB doesn’t exist yet
    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create object stores if they don't exist
      STORES.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          // Each store holds an array of objects, so we use a keyPath for unique IDs
          db.createObjectStore(storeName, { keyPath: "user_id" });
        }
      });

      
    };

    request.onsuccess = function (event) {

      resolve(event.target.result);
    };

    request.onerror = function (event) {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };
  });
}