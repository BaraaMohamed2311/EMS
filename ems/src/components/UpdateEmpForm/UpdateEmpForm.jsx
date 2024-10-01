import Form from "../Form/Form";
import {inputs_info , select_options , check_box} from "./data"
import updateEmpFetch from "@/utils/updateEmpFetch";
import { useState ,useRef} from "react";
import styles from "./update_emp_form.module.css"
import { useUserDataContext } from "@/contexts/user_data";
import userNotification from "@/utils/userNotification";
import { useRouter } from "next/navigation";
import { useCachedEmployeesContext } from "@/contexts/cached_employees";
export default function UpdateEmpForm({url ,isEditing , setIsEditing , employee_displayed ,currPage }){
    
    let [formBtnState, setFormBtnState] = useState("Update");
    let [isLoadingBtn , setIsLoadingBtn ] = useState(false);
    
    const {setCached_Employees} = useCachedEmployeesContext()
    let {user_data} = useUserDataContext()
    const router =useRouter();
    /*********************************************************/

    /*** All Input Elements are assigned refrence wether they are rendered or not***/
    inputs_info.forEach((input) => {
        input.ref = useRef();
      });
      select_options.select_position_options.ref = useRef();
      select_options.select_role_options.ref = useRef();
      check_box.forEach((box) => {
        box.ref = useRef();
      });
    /****************************************/
    // update handler to send update request
     function update_handler(e, url, token) {
        e.preventDefault();
      
        let actions = [];
        let updated_user_body = {};
        let isValid = true;

        // First loop: inputs_info and select_position_options
        [...inputs_info, select_options.select_position_options].forEach((input) => {
          
          if ( input.ref.current && !input.ref.current.value) {
            userNotification("error", "Input fields cannot be empty");
            isValid = false;
          }
          // we check at first that input element is rendered using current of reference
          if (input.ref.current && (input.ref.current.value !== employee_displayed[input.name])) {
              updated_user_body[input.name] = input.ref.current.value;
            if (!actions.includes("Modify Data")) actions.push("Modify Data"); // Add "MD" if not already added
          }
        });
      
        // Second loop: select_role_options
        [select_options.select_role_options].forEach((input) => {
          if (input.ref.current && !input.ref.current.value) {
            userNotification("error", "Input fields cannot be empty");
            isValid = false;
          }
          // we check at first that input element is rendered using current of reference
          if (input.ref.current && (input.ref.current.value !== employee_displayed[input.name])) {
            updated_user_body[input.name] = input.ref.current.value;
            if (!actions.includes("Modify Role")) actions.push("Modify Role"); // Add "MR" if not already added
          }
        });
      
        // Third loop: check_box
        let updated_emp_perms = [];
        check_box.forEach((box) => {
          // we check at first that input element is rendered using current of reference
          if (box.ref.current && box.ref.current.checked) {
            updated_emp_perms.push(box.value);
            if (!actions.includes("Modify Perms")) actions.push("Modify Perms"); // Add "MP" if not already added
          }
        });
      
        updated_user_body.emp_perms = updated_emp_perms.join(", ");

      
        // Join actions array to form the action string
        let actionString = actions.join("-");
        /*******************/
        const reqBody = {
                      modifier_id: user_data.emp_id,
                      emp_id: employee_displayed.emp_id,
                      other_emp_email:employee_displayed.emp_email,
                      ...updated_user_body
                    }
        if (isValid) {
          updateEmpFetch(url, token, reqBody ,actions , setCached_Employees , currPage , router);
        }

        
      }
      

    return (
        <div className={styles["update-emp-page"]}>
            <div className={styles["center"]}>
                {/* we have to check user modifier perms to check which inputs are displayed for editable fields  */}
                <Form 
                    form_handler = {(e)=>update_handler(e ,"list/update-others" , user_data.token )}
                    // add employee_displayed to form to show prev values of inputs
                    employee_displayed = {employee_displayed} 
                    // removes Role selection if no permission
                    select_options={  
                    user_data.emp_perms && user_data.emp_perms.has("Modify Role") ?
                    select_options : {select_position_options :select_options.select_position_options

                    }} 
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