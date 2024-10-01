import styles from "./form.module.css"; 
import Link from "next/link";
import Inputs from "../Inputs/Inputs"
import Select from "../Select/Select";
import { useUserDataContext } from "@/contexts/user_data";
export default function Form({
    form_handler , formBtnState , inputs_info,check_box, select_options ,
    formKind , isEditing , setIsEditing , employee_displayed,isLoadingBtn}) {

    let {user_data} = useUserDataContext()
    return (
        <form className={formKind === "update_form" ? styles.sided_form :""} method="post" onSubmit={form_handler}>
            
            {/* for any page display input fields with corresponding label and type */}
            <Inputs formKind={formKind} inputs_info={inputs_info} employee_displayed={employee_displayed} />

            {/* for register or update user pages we display select for positions */}
            {(formKind === "register" || formKind === "update_form") && select_options.select_position_options &&
                <Select styles={styles} select_options={select_options.select_position_options} employee_displayed={employee_displayed}/>
            }
            {/* for r update user page we display select for Role */}
            {formKind === "update_form" && select_options.select_role_options &&
                <Select styles={styles} select_options={select_options.select_role_options} employee_displayed={employee_displayed}/>
            }

            {/* for login page we display forgot pass link */}
            {formKind === "login" && 
                <div className={styles.pass}>
                    <Link href="/forget-password">Forgot Password?</Link>
                </div>
            }

            {user_data.role_name === "SuperAdmin" && 
                <div className={styles.perms_checkbox}>
                    {<Inputs inputs_info={check_box} type={"checkbox"} employee_displayed={employee_displayed} />}
                </div>
            }

            {/* for everypage we use frombtnstate to display text corressponding to it's from
                for ex if login page then Login text displates , if register then a register displayed ..etc */}
            <button
                className={`${styles.formButton}  ${(isLoadingBtn ? "loading_btn" : "")}`}
                disabled={formBtnState === "Submitting"}
                type="submit"
            >
                {formBtnState}
            </button>


            {/* if form displayed in login page we display signip link */}
            {formKind === "login" && 
                <div className={styles.signup_link}>
                    Not a member? <Link href="/register">Signup</Link>
                </div>
            }

            {/* if form displayed edit user data page we display cancel button */}
            {isEditing && 
            <button
                onClick={()=>setIsEditing(false)}
                className={styles.formButton}
                disabled={formBtnState === "Submitting"}
                type="button"
            >
                Cancel
            </button>}
            

            
            
        </form>
    );
}
