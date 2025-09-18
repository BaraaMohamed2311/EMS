import Form from "../Form/Form";
import {inputs_info , select_options , check_box} from "./data"
import updateEmpFetch from "@/utils/updateEmpFetch";
import { useState ,useRef} from "react";
import styles from "./update_emp_form.module.css"
import { useUserDataContext } from "@/contexts/user_data";
import userNotification from "@/utils/userNotification";
import { useRouter } from "next/navigation";
import { useCachedEmployeesContext } from "@/contexts/cached_employees";
export default function UpdateEmpForm({isEditing , setIsEditing , employee_displayed ,currPage }){
    
    let [formBtnState, setFormBtnState] = useState("Update");
    let [isLoadingBtn , setIsLoadingBtn ] = useState(false);
    let inputsBoxsRef = useRef({});
    let checkBoxsRef = useRef({});
    let selectBoxsRef = useRef({});
    const {setCached_Employees} = useCachedEmployeesContext()
    let {user_data} = useUserDataContext()
    const router = useRouter();

/***************************************update_handler***************************************/
     function update_handler(e, url, token) {
        e.preventDefault();
        // get updated user data and actions that were made
        let {updatedEmployeeData , actionString} = checkActionsMade();
        

        const reqBody = {
                      modifier_id: user_data.emp_id,
                      
                      emp_id: employee_displayed.emp_id,
                      employee_emp_email:employee_displayed.emp_email,
                      ...updatedEmployeeData
                    }

          updateEmpFetch(url, token, reqBody ,actionString , setCached_Employees , currPage , router);
        

        
      }
/***************************************checkActionsMade***************************************/
      function checkActionsMade(){

        let actions = [];
        let updatedEmployeeData = {};
        const employee_displayed_perms = new Set(employee_displayed.emp_perms.split(", "));

    // ====================================================== Modify Data ======================================================

       // === 1. Check for changes in general input fields

        inputs_info.forEach((input_info) => {
          //  Check If any inputBox is empty 
          if ( (inputsBoxsRef.current[input_info.name] && !inputsBoxsRef.current[input_info.name].value) ){
            userNotification("error", "Input fields cannot be empty");
            return
          }
          
          // we check at first that input element is rendered using current of reference
          else if (inputsBoxsRef.current[input_info.name] && (inputsBoxsRef.current[input_info.name].value !== employee_displayed[input_info.name])) {
              updatedEmployeeData[input_info.name] = inputsBoxsRef.current[input_info.name].value;
            if (!actions.includes("Modify Data")) actions.push("Modify Data"); // Add "MD" if not already added
          }
          
        });

        // === 2. Check If any SelectBox is empty ===

        if ( 
            (selectBoxsRef.current[select_options.select_title_options.name] && !selectBoxsRef.current[select_options.select_title_options.name].value) ||
            (selectBoxsRef.current[select_options.select_speciality_options.name] && !selectBoxsRef.current[select_options.select_speciality_options.name].value) ||
            (selectBoxsRef.current[select_options.select_role_options.name] && !selectBoxsRef.current[select_options.select_role_options.name].value) 
          ){
            userNotification("error", "Input fields cannot be empty");
            return
          }

        // === 3. Check for changes in Title ===


          // we check at first that input element is rendered using current of reference
          if (selectBoxsRef.current[select_options.select_title_options.name] && (selectBoxsRef.current[select_options.select_title_options.name].value !== employee_displayed[select_options.select_title_options.name])) {
            updatedEmployeeData[select_options.select_title_options.name] = selectBoxsRef.current[select_options.select_title_options.name].value;
            if (!actions.includes("Modify Data")) actions.push("Modify Data"); 
          }

          // === 4. Check for changes in Speciality ===

          // we check at first that input element is rendered using current of reference
          if (selectBoxsRef.current[select_options.select_speciality_options.name] && (selectBoxsRef.current[select_options.select_speciality_options.name].value !== employee_displayed[select_options.select_speciality_options.name])) {
            updatedEmployeeData[select_options.select_speciality_options.name] = selectBoxsRef.current[select_options.select_speciality_options.name].value;
            if (!actions.includes("Modify Data")) actions.push("Modify Data"); 
          }


      //  ====================================================== Modify Role ======================================================
        
        

          // we check at first that input element is rendered using current of reference
          if (selectBoxsRef.current[select_options.select_role_options.name] && (selectBoxsRef.current[select_options.select_role_options.name].value !== employee_displayed[select_options.select_role_options.name])) {
            updatedEmployeeData[select_options.select_role_options.name] = selectBoxsRef.current[select_options.select_role_options.name].value;
            if (!actions.includes("Modify Role")) actions.push("Modify Role"); // Add "MR" if not already added
          }
        
      
      // ====================================================== Modify Permissions ======================================================
        
        let updated_emp_perms = [];
        let permModified = false; // Track if any permission was modified

        check_box.forEach((check_box_info) => {
            const isCurrentlyChecked = checkBoxsRef.current[check_box_info.name].checked;
            const wasPreviouslyChecked = employee_displayed_perms.has(check_box_info.value);
            
            // Check if permission state changed
            if (isCurrentlyChecked !== wasPreviouslyChecked) {
                permModified = true; // Mark that permissions were modified
            }
            
            // Add to updated array if currently checked (scenarios 1 and 2)
            if (isCurrentlyChecked) {
                updated_emp_perms.push(check_box_info.value);
            }
        });

        // Scenario 3: If all permissions were unchecked but some existed before
        // OR if any permission was changed in any way
        if (permModified || (updated_emp_perms.length === 0 && employee_displayed_perms.size > 0)) {
            if (!actions.includes("Modify Perms")) {
                actions.push("Modify Perms");
            }
        }
        console.log("Updated Permissions:", updated_emp_perms);
        updatedEmployeeData.newperms = updated_emp_perms.join(", ");

      
        // Join actions array to form the action string
        let actionString = actions.join("-");

        return {
          updatedEmployeeData,
          actionString,
          
        };

    }
    return (
        <div className={styles["update-emp-page"]}>
            <div className={styles["center"]}>
                {/* we have to check user modifier perms to check which inputs are displayed for editable fields  */}
                <Form 
                    references ={{ inputsBoxsRef, checkBoxsRef ,selectBoxsRef}} 
                    form_handler = {(e)=>update_handler(e ,"list/update-others" , user_data.token )}
                    // add employee_displayed to form to show prev values of inputs
                    employee_displayed = {employee_displayed} 
                    // removes Role selection if no permission
                    select_options={  
                    user_data.emp_perms && user_data.emp_perms.has("Modify Role") ? select_options : {select_title_options :select_options.select_title_options , select_speciality_options: select_options.select_speciality_options}} 
                    /*removes check box of perms for user who\s not allowed to edit others perms */
                    check_box={ user_data.emp_perms && user_data.emp_perms.has("Modify Perms") ?
                                check_box : null } 


                    inputs_info = { user_data.emp_perms && !user_data.emp_perms.has("Modify Salary") && 
                        inputs_info.forEach((input , indx)=>{
                            /*this ensures only  delete salary input if no permission to edit */
                            if(input.id === "emp_salary")
                                inputs_info.splice(indx , 1)
                            }) ? inputs_info : inputs_info
                }
                    formBtnState = {formBtnState}  
                    isLoginPage={false} 
                    isEditing={isEditing}  
                    setIsEditing={setIsEditing} 
                    formKind={"update_form"}/>
            </div>
        </div>
    )
}