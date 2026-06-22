import statusNotification from "./statusNotification";
import userNotification from "./userNotification";
import { getCachedUserImage, cacheUserImage } from "./indexDB/get_set_cachedImage";

export default async function getUserImage(url, user_id, token, setBlobURL) {

  // 1. Try cached version first
  const cached = await getCachedUserImage(user_id);
  if (cached) {
    return setBlobURL(cached);
  }

  // 2. Fetch new image in background
  fetch(`${process.env.APIKEY}${url}?user_id=${user_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(async (res) => {
      statusNotification(res.status);

      if (res.headers.get("Content-Type")?.includes("application/json")) {
        const json = await res.json();
        return { type: "json", res: json };
      }

      return { type: "image", res: await res.blob() };
    })
    .then(async (data) => {
      if (data.type === "json") return;

      if (!data.res || data.res.size === 0) {
        setBlobURL("/avatar.jpg");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataURL = reader.result;

        // update UI
        setBlobURL(dataURL);

        // Cache it
        await cacheUserImage(user_id, dataURL);
      };
      reader.readAsDataURL(data.res);
    })
    .catch(() => {
      userNotification("error", "Error loading user image");
    });
}
