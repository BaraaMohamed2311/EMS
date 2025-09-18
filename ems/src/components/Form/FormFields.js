import Select from "../Select/Select";
import Link from "next/link";
import Inputs from "../Inputs/Inputs"
import { useEffect , useState} from "react";
import { global_mapped_specialities } from "@/global_data";

function RegisterFormFields({
  select_options,
  employee_displayed,
  styles,
  references,
}){
    /* Get Change of title's selected value */
    const [selectedTitleValue, setSelectedTitleValue] = useState(employee_displayed?.emp_title ?? "");

    /* Get Corresponding specialities for title */
    const specialities_for_title = {...select_options.select_speciality_options, options: global_mapped_specialities[selectedTitleValue]};
    console.log("select_options xxxxasdd",select_options)
    console.log(select_options.select_title_options , specialities_for_title)
    return (
        <>
        {/*display select for positions */}
        <Select styles={styles} select_options={select_options.select_title_options} employee_displayed={employee_displayed} reference={references.selectBoxsRef} onChange={(e)=>setSelectedTitleValue(e.target.value)}/>
        <Select styles={styles} select_options={specialities_for_title} employee_displayed={employee_displayed} reference={references.selectBoxsRef}/>
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
    /* Get Change of title's selected value */
    const [selectedTitleValue, setSelectedTitleValue] = useState(employee_displayed?.emp_title ?? "");

    /* Get Corresponding specialities for title */
    const specialities_for_title = {label:"Speciality",options: global_mapped_specialities[selectedTitleValue]};
    console.log("specialities_for_title",specialities_for_title ,"\n", select_options.select_title_options);

    return (
        <>
        {/* display select for positions */}
        <Select styles={styles} select_options={select_options.select_title_options} employee_displayed={employee_displayed} reference={references.selectBoxsRef} onChange={(e)=>setSelectedTitleValue(e.target.value)}/>
        <Select styles={styles} select_options={specialities_for_title} employee_displayed={employee_displayed} reference={references.selectBoxsRef}/>
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