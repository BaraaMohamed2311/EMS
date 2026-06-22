const router = require("express").Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Profile_Pic_Module = require("../Models/Profile_Pic");
const mongoose = require("mongoose");
const conect_mongodb = require("../Utils/connect_mongodb");
const connect_bucket = require("../Utils/connect_mongo_bucket");
const deleteFromBucket = require("../middlewares/deleteFromBucket");
const jwtVerify = require("../middlewares/jwtVerify");

// ===1. Define allowed types
const ProfileImagemimetypes = new Set([
  "image/jpeg",
  "image/JPEG",
  "image/png",
  "image/jpg",
  "image/JPG",
  "image/PNG",
]);

// ===2. Lazy URL getter — throws a clear error instead of crashing at startup
function getMongoUrl() {
  const url = process.env.EMS_MongoDB;
  if (!url) throw new Error("EMS_MongoDB environment variable is not set");
  return url;
}

// ===3. Lazy bucket getter — throws if DB not connected
function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected — check EMS_MongoDB env var");
  return connect_bucket(db, "uploads");
}

// ===4. Lazy storage factory — created per-request, not at module load
function createProfileStorage() {
  return new GridFsStorage({
    url: getMongoUrl(),
    file: (req, file) => {
      if (ProfileImagemimetypes.has(file.mimetype)) {
        return {
          bucketName: "uploads",
          filename: `${file.originalname}_${Date.now()}`,
        };
      }
      return null;
    },
  });
}

// ===5. Middleware factory — wraps multer with error handling
function uploadProfileImgMiddleware(req, res, next) {
  try {
    const upload = multer({ storage: createProfileStorage() });
    upload.single("user_pic")(req, res, next);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


// ==============================================
//                Get User Image
// ==============================================

router.get("/profile", jwtVerify, async (req, res) => {
  try {
    const bucket = getBucket();
    if (bucket) {
      const user = await Profile_Pic_Module.findOne({
        user_id: req.query["user_id"],
      });

      if (!user || !user.user_pic.file_name) {
        res.header("Content-Type", "application/json");
        return res.status(404).json({
          success: false,
          message: "User Has No Image",
        });
      }

      const cursor = await bucket.find({
        filename: user.user_pic.file_name,
      });
      const docsArray = await cursor.toArray();

      if (docsArray[0] && docsArray[0].filename) {
        bucket.openDownloadStreamByName(docsArray[0].filename).pipe(res);
      } else {
        res.header("Content-Type", "application/json");
        return res.status(404).json({
          success: false,
          message: "Image file not found",
        });
      }
    } else {
      res.header("Content-Type", "application/json");
      return res.status(404).json({
        success: false,
        message: "Mongo Bucket is undefined",
      });
    }
  } catch (err) {
    res.header("Content-Type", "application/json");
    res.status(500).json({
      success: false,
      message: err.message || "Error GET Profile Picture",
    });
  }
});


// ==============================================
//                Update User Image
// ==============================================
router.put(
  "/profile",
  jwtVerify,
  async (req, res, next) => {
    try {
      await deleteFromBucket(getBucket(), req, res, next);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  uploadProfileImgMiddleware,
  async (req, res) => {
    try {
      const bucket = getBucket();
      if (bucket) {
        const maxSizeInBytes = 20 * 1024 * 1024; // 20MB

        if (req.file.size > maxSizeInBytes)
          return res.status(400).json({
            success: false,
            message: "Image Size Must be 50Kbs At Max",
          });

        await Profile_Pic_Module.findOneAndUpdate(
          { user_id: req.query["user_id"] },
          { user_pic: { file_name: req.file.filename, ImgId: req.file.id } },
          { upsert: true, new: true }
        );

        if (req.file && req.file.filename) {
          bucket.openDownloadStreamByName(req.file.filename).pipe(res);
        } else {
          res.header("Content-Type", "application/json");
          return res.status(400).json({
            success: false,
            message: "Image Not Valid",
          });
        }
      } else {
        res.header("Content-Type", "application/json");
        return res.status(404).json({
          success: false,
          message: "Mongo Bucket is undefined",
        });
      }
    } catch (err) {
      console.log("Error Update Profile Picture", err);
      res.status(500).json({
        success: false,
        message: err.message || "Error Update Profile Picture",
      });
    }
  }
);

module.exports = router;