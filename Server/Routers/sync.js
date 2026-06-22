const router = require("express").Router();
const jwtVerify = require("../middlewares/jwtVerify.js");
const SyncMethods = require("../Utils/methods/SyncMethods.js");

// =================================
//  Get All Employees Data Sync
// =================================
router.get("/employees", async (req, res) => {
    try {
        const {  max_version } = req.query;

        const { needsSync, latest_version } =
            await SyncMethods.syncAllEmployeesFullData( max_version);

        res.json({ success: true, needsSync, latest_version });

    } catch (err) {
        console.error("Error List Employees Profile Data", err);
        res.status(500).json({ success: false, message: "Error List Employees Data" });
    }
});




module.exports = router;
