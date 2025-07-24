import Select from "../Select/Select";
import Link from "next/link";
import Inputs from "../Inputs/Inputs"
function RegisterFormFields({
  select_options,
  employee_displayed,
  styles,
  references,
}){
    return (
        <>
        {/*display select for positions */}
        <Select styles={styles} select_options={select_options.select_position_options} employee_displayed={employee_displayed} reference={references.selectBoxsRef}/>
        </>
    )
}

function UpdateUserFormFields({
    references,
  check_box,
  select_options,
  isEditing,
  setIsEditing,
  formBtnState,
  employee_displayed,
  user_data,
  styles,
}){

    return (
        <>
        {/* display select for positions */}
        <Select styles={styles} select_options={select_options.select_position_options} employee_displayed={employee_displayed} reference={references.selectBoxsRef}/>
        {/* display select for Role */}
        <Select styles={styles} select_options={select_options.select_role_options} employee_displayed={employee_displayed} reference={references.selectBoxsRef}/>
        {/* Update Role If you have permission*/}
        {user_data.role_name === "SuperAdmin" && 
                <div className={styles.perms_checkbox}>
                    {<Inputs inputs_info={check_box} type={"checkbox"} employee_displayed={employee_displayed}  references = {references.checkBoxsRef}/>}
                </div>
            }
        {/* cancel edit button */}
        {isEditing && 
            <button
                onClick={()=>setIsEditing(false)}
                className={styles.formButton}
                disabled={formBtnState === "Submitting"}
                type="button"
            >
                Cancel
            </button>}
        </>
    )
}

function LoginFormFields({
  styles,
}){
    return (
        <>
        <div className={styles.pass}>
                    <Link href="/forget-password">Forgot Password?</Link>
        </div>
        <div className={styles.signup_link}>
                    Not a member? <Link href="/register">Signup</Link>
                </div>
        </>
    )
}

export {LoginFormFields, UpdateUserFormFields, RegisterFormFields};