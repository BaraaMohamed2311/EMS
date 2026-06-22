/*******************************************************************
    Gets detailed data from MySQL and MongoDB Databases 
*********************************************************************/
const router = require("express").Router();
const jwtVerify = require("../middlewares/jwtVerify.js");
const User = require("../Classes/User.js");
const CompanyUsersMethods = require("../Classes/CompanyUsers/CompanyUsersMethods.js");
const mailer = require("../Utils/mailer");
const buildJoinedUpdate = require("../Utils/buildJoinedUpdate.js");
const { approvalRequiredFields ,roleToEntityMap} = require("../Tables/data.js");
const { pickAllowedFields , SELF_UPDATE_FIELDS} = require("../Tables/pick_exc_fields.js");
// =================================
//  Get One Patient Data MySQL
// =================================
router.get("/employee/:id",jwtVerify,async (req,res)=>{
    try{
        const {  id : user_id } = req.params;

        //Bad Request if modifier id or others doesn't exist
        if( !user_id ) return res.status(400).json({success:false,message:"Bad Request"});

        const employeeTitle = await User.getUserTitleByID(user_id);

        if(!employeeTitle || !CompanyUsersMethods.isCompanyUser(employeeTitle)){
            return res.status(404).json({success : false , message:"No Users Found !"})
        }

        const employeeData = await CompanyUsersMethods.MapUserToGETFullDataFunction(user_id,employeeTitle);

      if( employeeData ){
        res.status(200).json({success : true , body:employeeData, message:"Successfully Fetched Data"})
      }
      else{
        res.status(404).json({success : false , message:"No Users Found !"})
      }

        
    }
    catch(err){
        console.error("Error Get Full Details Of Employee",err);
        res.status(500).json({
            success:false,
            message: err.message || "Error Get Full Details Of Employee"
        })
    }
})

// =================================
//  Patch Any User  (we will update specific fields not whole user data)
// =================================
router.patch("/self",jwtVerify, async (req, res) => {
    try {
        const { user_id, ...newUserDetails } = req.body;
        

        // all these fields required to delete & send email
        if(!user_id  ) return res.status(400).json({success:false,message:"Bad Request"});

        const userExists = await User.checkIfUserExistsById(user_id);

        if(!userExists){
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        const safeData = pickAllowedFields(newUserDetails, SELF_UPDATE_FIELDS);

        
        if(safeData.user_email){
            const emailExists = await User.checkIfUserExistsByEmail(safeData.user_email);
            if(emailExists){
                return res.status(409).json({ success: false, message: "Email Already In Use" });
            }
        }
        // get title to know which table to update
        const userTitle = await User.getUserTitleByID(user_id);

        // build the updating string for query
        const updatingObj = buildJoinedUpdate(safeData);

        const isUpdated =  await CompanyUsersMethods.MapUserToFullUpdateFunction(user_id, userTitle, updatingObj);

        if(isUpdated){
            return res.status(200).json({ success: true, message: "User Updated Successfully" });
        }
        else{
            return res.status(409).json({ success: false, message: "Failed to update user data" });
        }
        
    } catch (err) {
        res.json({
            success: false,
            message: err.message || "Error Patching user Data"
        });
    }
});





module.exports = router;
