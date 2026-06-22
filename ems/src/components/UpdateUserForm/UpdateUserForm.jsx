import Form from "../Form/Form";
import { useState } from "react";
import styles from "./update_emp_form.module.css";
import { useRouter } from "next/navigation";
export default function UpdateUserForm({
    url,
    user_displayed,
    currPage,
    // New props
    references, // Contains all refs: inputsBoxsRef, checkBoxsRef, selectBoxsRef
    update_handler,
    modifier_data,
    fieldDefinitions,
    isUpdatingSelf=false,
    token

}) {
  
    let [formBtnState, setFormBtnState] = useState("Update");
    let [isLoadingBtn , setIsLoadingBtn ] = useState(false);
    let {inputsBoxsRef , checkBoxsRef , selectBoxsRef} = references;

    const { select_role_options, ...otherOptions } = fieldDefinitions.select_def || {};
    const { perms_check_box, ...otherCheckBoxes } = fieldDefinitions.check_box || {};

    const is_authorized_to_update_roles =  modifier_data?.emp_perms?.has("Modify Employee Role") && modifier_data?.role_name === "SuperAdmin";
    const is_authorized_to_update_perms =  modifier_data?.emp_perms?.has("Modify Employee Perms");
    const is_authorized_to_update_salary =  modifier_data?.emp_perms?.has("Modify Salary");


    // Filter inputs_info based on authorization
    const authorized_inputs_info = fieldDefinitions.inputs_info?.filter(
    input => {
        // Remove Bonus and Salary fields if user is not authorized
        if (!is_authorized_to_update_salary) {
            return input.name !== "emp_bonus" && input.name !== "emp_salary";
        }
        return true; // keep all fields if authorized
    }
);

    // Here we filter the fieldDefinitions based on the modifier's permissions

    const authorized_select_def = (() => {
        if (!fieldDefinitions.select_def) return {};

        if (is_authorized_to_update_roles) {
            return fieldDefinitions.select_def; // keep as-is
        }

        // strip only role-related selects
        const { select_role_options, ...rest } = fieldDefinitions.select_def;
        return rest;
        })();
    const authorized_check_box = (() => {
        if (!fieldDefinitions.check_box) return {};

        if (is_authorized_to_update_perms) {
            return fieldDefinitions.check_box; // keep everything
        }

        // strip non-authorized checkbox groups
        const { perms_check_box, ...rest } = fieldDefinitions.check_box;
        return rest;
        })();

        // Construct the final authorized field definitions
    const authorizedFieldDefinitions = {
        inputs_info: authorized_inputs_info, // always allowed
        select_def: authorized_select_def,
        check_box: authorized_check_box
};



    return (
        <>
            <div className={styles["center"]}>
                {/* we have to check user modifier perms to check which inputs are displayed for editable fields  */}
                <Form 
                    references ={{ inputsBoxsRef, checkBoxsRef ,selectBoxsRef}} 
                    form_handler = {(e)=>update_handler(e ,url , token ,authorizedFieldDefinitions)}
                    // add employee_displayed to form to show prev values of inputs
                    user_displayed = {user_displayed} 
                    fieldDefinitions={authorizedFieldDefinitions}
                    formBtnState = {formBtnState}  
                    isLoginPage={false} 

                    formKind={"update_form"}/>
            </div>
        </>
    )
}