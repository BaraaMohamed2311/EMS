import styles from "./form.module.css"; 

import Inputs from "../Inputs/Inputs"

import { useUserDataContext } from "@/contexts/user_data";

import {LoginFormFields, UpdateUserFormFields, RegisterFormFields} from "./FormFields.js";

const FormFieldsMap = {
    register_form: RegisterFormFields,
    update_form: UpdateUserFormFields,
    login_form: LoginFormFields,
};

export default function Form({
    references, form_handler , formBtnState ,
     inputs_info,check_box, select_options ,
    formKind , isEditing , setIsEditing ,
     employee_displayed , isLoadingBtn}) {

    let {user_data} = useUserDataContext();
     const Fields = FormFieldsMap[formKind] || (() => null);
     console.log("references", references,"inputs_info",inputs_info);
    return (
        <form className={formKind === "update_form" ? styles.sided_form :""} method="post" onSubmit={form_handler}>
            
            {/* for any page display input fields with corresponding label and type */}
            <Inputs formKind={formKind} inputs_info={inputs_info} employee_displayed={employee_displayed} references = {references.inputsBoxsRef}/>

            {/* Form-kind-specific fields */}
            <Fields
            
                check_box={check_box}
                references={references}
                select_options={select_options}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                formBtnState={formBtnState}
                employee_displayed={employee_displayed}
                user_data={user_data}
                styles={styles}
            />


            {/* The submit button for each form page Login\Register\etc..*/}
            <button
                className={`${styles.formButton}  ${(isLoadingBtn ? "loading_btn" : "")}`}
                disabled={formBtnState === "Submitting"}
                type="submit"
            >
                {formBtnState}
            </button>

            
            
        </form>
    );
}
