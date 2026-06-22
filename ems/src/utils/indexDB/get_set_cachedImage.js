import {openIndxDB} from "./openIndxDB"
export async function getCachedUserImage(user_id) {
  const db = await openIndxDB();
  return new Promise((resolve) => {
    const tx = db.transaction("user_images", "readonly");
    const store = tx.objectStore("user_images");
    const req = store.get(user_id);

    req.onsuccess = () => resolve(req.result?.dataURL || null);
    req.onerror = () => resolve(null);
  });
}

export async function cacheUserImage(user_id, dataURL) {
  const db = await openIndxDB();
  return new Promise((resolve) => {
    const tx = db.transaction("user_images", "readwrite");
    const store = tx.objectStore("user_images");
    store.put({ user_id, dataURL });
    tx.oncomplete = () => resolve(true);
  });
}
