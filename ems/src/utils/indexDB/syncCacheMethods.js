
import {getRecordById} from '../indexDB/getCacheMethods';
// ===================================
//        Cache Synchronization Utilities
// ===================================

/**
 * Synchronizes cached state with IndexedDB for specific updated records
 * @param {Function} setCachedData - State setter function for cached records
 * @param {Set} updatedRecordIds - Set of record IDs that were updated in IndexedDB
 * @param {string} storeName - Name of the IndexedDB store to fetch from
 * @returns {Promise<void>}
 */
export const syncUpdatedRecordsWithCache = async (setCachedData, updatedRecordIds, storeName) => {
  if (!updatedRecordIds || !(updatedRecordIds instanceof Set) || updatedRecordIds.size === 0) {
    console.warn('No updated record IDs provided for cache synchronization');
    return;
  }

  if (!setCachedData) {
    console.error('No state setter function provided');
    return;
  }

  try {
    // Fetch all updated records from IndexedDB in parallel
    const updatePromises = Array.from(updatedRecordIds).map(id => 
      getRecordById(storeName, id)
    );
    
    const updatedRecords = await Promise.all(updatePromises);
    const validUpdatedRecords = updatedRecords.filter(record => record !== null && record !== undefined);

    if (validUpdatedRecords.length === 0) {
      console.warn('No valid records found for the provided IDs');
      return;
    }

    // Update the cached state with the latest records
    setCachedData(prevCachedData => {
      if (!Array.isArray(prevCachedData)) {
        console.error('Cached data is not an array');
        return prevCachedData;
      }

      const updatedDataMap = new Map();
      validUpdatedRecords.forEach(record => {
        if (record && record.id) {
          updatedDataMap.set(record.id, record);
        }
      });

      // Create new array with updated records
      const updatedData = prevCachedData.map(record => 
        updatedDataMap.has(record.id) ? updatedDataMap.get(record.id) : record
      );

      return updatedData;
    });

  } catch (error) {
    console.error('Failed to synchronize cache with IndexedDB:', error);
  }
};

