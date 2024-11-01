const jwtVerify = require("../middlewares/jwtVerify");
const executeMySqlQuery = require("../Utils/executeMySqlQuery");

const router = require("express").Router();



/**           Get User Image           **/
// if user doesn't exist create it
  router.get("/main" ,jwtVerify,async (req,res)=>{
    try{ 
        const GetEmpsData = `SELECT COUNT(*) as count ,SUM(emp_abscence) as abscence , SUM(emp_salary) as salaries , SUM(emp_bonus) as bonus  FROM employees`;
        const GetNumOfSuperAdmins = `SELECT COUNT(*) as count FROM employees e JOIN roles r ON e.emp_id = r.emp_id WHERE r.role_name = 'SuperAdmin' `;
        const GetNumOfAdmins = `SELECT COUNT(*) as count FROM employees e JOIN roles r ON e.emp_id = r.emp_id WHERE r.role_name = 'Admin'`;


        const EmpsData = await executeMySqlQuery(GetEmpsData);
        const NumOfSuperAdmins = await executeMySqlQuery(GetNumOfSuperAdmins);
        const NumOfAdmins = await executeMySqlQuery(GetNumOfAdmins);


        if(EmpsData[0] && NumOfSuperAdmins[0] && NumOfAdmins[0] )
            return res.status(200).json({success: true , body:{
                        numOfEmployees : EmpsData[0].count,
                        numOfSuperAdmins : NumOfSuperAdmins[0].count,
                        numOfAdmins : NumOfAdmins[0].count,
                        totalAbscence :EmpsData[0].abscence,
                        totalSalariesPaid :EmpsData[0].salaries,
                        totalBonusPaid :EmpsData[0].bonus
                    }, message:"Successful Get Data Dashboard" });
        else{
            return res.status(404).json({success: false , message:"Something Went Wrong" });
        }
    }
    catch(err){
        console.error("Error GET Dashboard Data",err);
        res.status(500).json({
            success:false,
            message:"Error GET Dashboard Data"
        })
    }
})




module.exports = router;