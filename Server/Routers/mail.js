const router = require("express").Router();
const mailer = require("../Utils/mailer")
    

    /*  Mail Others  */
    router.post("/mail-employee", async function(req, res) {
        const {SendFrom , SendTo , subject , text} =req.body;
        try{
            //(SendFrom , SendTo , subject , text)
            const isSent =await mailer(SendFrom ,SendTo, subject , text);

            if(isSent){
                res.status(200).json({
                    success:true,
                    message:"Email Sent Successfully"
                });
            }
            else{
                res.status(500).json({
                    success:false,
                    message:"Email Wasn't Sent"
                });
            }
        } catch (err) {
            console.log("Error Sending Email", err);
            res.status(500).json({
                success: false,
                message: "Error Sending Email"
            });
        }
    });

module.exports = router;