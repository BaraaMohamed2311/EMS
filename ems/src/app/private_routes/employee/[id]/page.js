"use client";
import styles from "./employee.module.css";
import private_routes from "../../page";
import { useCachedEmployeesContext } from "@/contexts/cached_employees";
import { useSearchParams, useParams } from "next/navigation";
import deleteFetch from "@/utils/deleteFetch";
import { useUserDataContext } from "@/contexts/user_data";
import { useRouter } from "next/navigation";
import getUserImage from "@/utils/getUserImg";
import UpdateEmpForm from "@/components/UpdateEmpForm/UpdateEmpForm";
import { useState ,useEffect} from "react";
import userNotification from "@/utils/userNotification";
import MoneyShortner from "@/utils/MoneyShortner";
import pickRoleIcon from "@/utils/pickRoleIcon"
import Image from "next/image";
function EmployeePage() {

  let [isEditing , setIsEditing ] = useState(false);
  let [blobURL , setBlobURL] = useState("/avatar.jpg");
  /** Contexts use **/
  let {  setCached_Employees } = useCachedEmployeesContext();
  let { user_data } = useUserDataContext();

  /** Url extraction **/
  let search_params = useSearchParams();
  const employeeString = new URLSearchParams(search_params);
  let {currPage , ...employee_displayed} = Object.fromEntries(employeeString.entries())
  
  currPage = parseInt(currPage);
  /** other hooks **/
  const router = useRouter();



  useEffect(()=>{
    // we fetch cached in localStorage if nothing then we fetch from db
    const reader = new FileReader();
      
      // create fileReader to read image once recieved from res
      reader.addEventListener('load',()=> UpdateState(reader.result));
      // fetch image
      getUserImage('/profile/prof-img', employee_displayed.emp_email , reader ,setBlobURL ,user_data.token)
    

    return ()=>{
      reader.removeEventListener('load', UpdateState)
    }

} ,[employee_displayed.emp_email, user_data.token]);

function UpdateState(reader_result){
      setBlobURL(reader_result);
}



  // handle deletion function
  async function handleDeletion(url, token, body) {

    // if no permission do not delete other user
    if(!user_data.emp_perms.has("Modify Data")){
      return userNotification("error","You Do Not Have Permession to Delete Others")
    }
    deleteFetch(url, token, body);
    // Delete from cache
    await setCached_Employees(prev => {
      // Get the current page's employee array and update it
      let newArray = Array.from(prev);
        return newArray.filter((employee)=>{
                return employee_displayed.emp_id !== employee.emp_id;
        })
      
    })
    router.replace("/private_routes/list");
  }
  

  

  

  return (
    <main className={styles["employee-main"]}>
      {/* Check that isEditing btn is clicked and user has permission to edit other user's data */}
      {user_data.emp_perms && user_data.emp_perms.has("Modify Data") && isEditing ? (
        <UpdateEmpForm
          currPage = {currPage}
          employee_displayed={employee_displayed}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className={styles["employee-container"]}>
          <div className={styles["employee-header"]}>
            <div className={styles["employee-img-wrapper"]}>
              {/* low priority for employees images to not affect user experience performance */}
              <Image priority={false}  src={blobURL} className={styles["employee-picture"]} width="192" height="192" alt="User Profile Image" />
            </div>
            
            <div className={styles["employee-info"]}>
              <h1 className={styles["employee-name"]}>{employee_displayed.emp_name}</h1>
              <p className={styles["employee-position"]}>{`${employee_displayed.emp_title} | ${employee_displayed.emp_specialty}`}</p>
              <p><strong>Email:</strong> {employee_displayed.emp_email}</p>
              <p><strong>Location:</strong> {employee_displayed.emp_address || "Not Specified"}</p>
              <p><strong>Member Since:</strong> {employee_displayed.emp_joined || "Not Specified"}</p>
            </div>
          </div>  
          
          <div className={styles["employee-details"]}>
            <ul className={styles["activity-list"]}>
              <li>
                <strong>Rating:</strong> <span className={styles.rating}>{employee_displayed.emp_rate || "Not Rated"}</span>
              </li>
              <li>
                <strong>This Month Bonus:</strong> 
                <span className={(user_data.emp_perms && (user_data.emp_perms.has("Modify Salary") || user_data.emp_perms.has("Display Salary")) )? "" : styles.hide_from_user}>
                  {user_data.emp_perms && (user_data.emp_perms.has("Modify Salary") || user_data.emp_perms.has("Display Salary")) ? MoneyShortner(employee_displayed.emp_bonus) : "Not Accessible"  }
                  </span>
              </li>
              
              <li><strong>This Month Absence:</strong> <span className={user_data.role_name === "SuperAdmin" ? "" : styles.hide_from_user}>{user_data.role_name !== "SuperAdmin" ? "Not Accessible" : employee_displayed.emp_abscence}</span></li>
              <li>
                  <strong>Salary:</strong>
                  <span className={user_data.emp_perms &&(user_data.emp_perms.has("Modify Salary") || user_data.emp_perms.has("Display Salary")) ? "" : styles.hide_from_user}>
                    {(user_data.emp_perms.has("Modify Salary") || user_data.emp_perms.has("Display Salary")) ?MoneyShortner(employee_displayed.emp_salary): "Not Accessible" }
                  </span>
              </li>
              <li className={styles.role_box}><strong>Role : </strong>{employee_displayed.role_name} <Image src={pickRoleIcon(employee_displayed.role_name)} width={"30"} height={"30"} alt="profile user role icon" /></li>
            <li className={styles.perms_box}><strong className={styles.perms_header}>Permissions </strong>
                      <div className={styles.perms_wrapper}>
                          {employee_displayed.emp_perms && employee_displayed.emp_perms[0] !== "None" ?(employee_displayed.emp_perms.split(", ").map((perm)=>{

                              return <span key={perm} className="perm">{perm}</span>
                              })) : "None"
                                }
                        </div>
              </li>

              <li className={styles["buttons-wrapper"]}>
                <button onClick={() => setIsEditing(prev => !prev)} className="grey-button">Edit Employee</button>
                <button
                  onClick={() =>
                    // delete button
                    handleDeletion("list/delete-employee", user_data.token , {
                      emp_id: employee_displayed.emp_id, 
                      emp_name:employee_displayed.emp_name,
                      emp_email: employee_displayed.emp_email,
                      modifier_email: user_data.emp_email ,
                      modifier_id: user_data.emp_id ,
                      modifier_name: user_data.emp_name ,
                    })
                  }
                  className="red-button"
                >
                  Delete Employee
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
  
}

export default private_routes(EmployeePage);
