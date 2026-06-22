// Example: get last sync for a store
export const getLastSync = (storeName) => {
  return localStorage.getItem(`${storeName}_lastSync`) || "" ;
};

// Example: set last sync for a store
export const setLastSync = (storeName, timestamp) => {
  localStorage.setItem(`${storeName}_lastSync`, timestamp);
};
