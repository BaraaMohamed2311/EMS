import styles from "./form.module.css"; 

import Inputs from "../Inputs/Inputs"

import { useUserDataContext } from "@/contexts/user_data";

import {FormFieldsMap} from "./FormFields.js";


export default function Form({
    references, form_handler , formBtnState ,
    formKind , 
     user_displayed , isLoadingBtn , fieldDefinitions}) {

    let {user_data} = useUserDataContext();
     const Fields = FormFieldsMap[formKind] || (() => null);
     
    const shared_inputs_meta = fieldDefinitions?.inputs_info

    return (
        <form className={formKind === "update_form" ? styles.sided_form :""} method="post" onSubmit={form_handler}>
            
            <Inputs  
            styles={styles } 
            label_type={"labeled_input"} 
            formKind={formKind} 
            inputs_info={shared_inputs_meta} 
            defaultValues={user_displayed} 
            references = {references.inputsBoxsRef}/>

            {/* Form-kind-specific fields */}
            <Fields
        
                references={references}

                formBtnState={formBtnState}
                user_displayed={user_displayed}
                user_data={user_data}
                styles={styles}
                fieldDefinitions={fieldDefinitions}
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
