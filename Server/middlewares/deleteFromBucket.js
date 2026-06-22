const Employees_Img_module = require("../Models/Profile_Pic");
const mongoose = require("mongoose");

async function deleteFromBucket(bucket, req, res, next) {
    if (!bucket) {
        return res.send({
            success: false,
            message: "Mongo Bucket is undefined",
        });
    }

    // search for employee image
    let old_employee = await Employees_Img_module.findOne({ user_id: req.query["user_id"] });

    // if no employee found or no user_pic, skip deletion
    if (!old_employee || !old_employee.user_pic || !old_employee.user_pic.ImgId) {
        return next();
    }

    // safe access of file ID and name
    const fileID = new mongoose.Types.ObjectId(old_employee.user_pic.ImgId);
    const fileName = old_employee.user_pic.file_name;

    // check if file exists in bucket
    const cursor = await bucket.find({ filename: fileName });
    const docsArray = await cursor.toArray();

    if (fileID && docsArray.length > 0) {
        await bucket.delete(fileID, (err) => {
            if (err) {
                consoleLog(`Error Deleting From Bucket ${err}`, "error");
                return res.json({
                    success: false,
                    message: "Error Deleting From Bucket"
                });
            }
            consoleLog(`File ${fileName} Deleted From Bucket`, "info");
        });
    }

    next();
}

module.exports = deleteFromBucket;
