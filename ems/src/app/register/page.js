
"use client";
import Form from "@/components/Form/Form";
import styles from "./register.module.css";
import { useRef, useState } from "react";
import {inputs_info , select_def} from "./data";
import userNotification from "@/utils/userNotification";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  let [formBtnState, setFormBtnState] = useState("Register");
  let router = useRouter();

  // ========================>MUST HAVE SAME ORDER IN references ARRAY AS inputs_info <=================

  let selectBoxsRef = useRef({});
  let inputsBoxsRef = useRef({});
  /**************************************/
  function register_handler(e){
    // preventing refresh
    e.preventDefault();

    // Validate all references before proceeding
    const validation = validateAllReferences();
    
    if (!validation.isValid) {
        userNotification('error', validation.message);
        return;
    }

    setFormBtnState("Loading...");
    // gathering values of body from refrences
    const requestBody ={}
  
    /******************************/
    inputs_info.forEach((input) => {
      requestBody[input.name]= inputsBoxsRef.current[input.name].value;
    });
    
    // Adding Title & specialty selection
    
      requestBody[select_def.select_title_options.name]= selectBoxsRef.current[select_def.select_title_options.name].value;
      requestBody[select_def.select_specialty_options.name]= selectBoxsRef.current[select_def.select_specialty_options.name].value;



    fetch(`${process.env.APIKEY}/user/register`, 
          {
          method:"POST",
          mode:"cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(requestBody)
        }
      )
      .then(res=>res.json())
      .then(data=>{
          if(data.success){
            // we assign user data to context
            setFormBtnState("Succeded")
            userNotification("success" , data.message);
            // navigate to home 
            router.replace("/")
            }
          
          else{
            setFormBtnState("Try Again");
            userNotification("error" , data.message)
          }
        })
        .catch(err=>{

          setFormBtnState("Try Again");
          userNotification("error" , data.message)
        })
  }

  // Validation function
function validateAllReferences() {
    const missingFields = [];
    
    // Check input references
    inputs_info.forEach((input) => {
        const ref = inputsBoxsRef.current[input.name];
        
        if (!ref) {
            missingFields.push(`Input reference for "${input.name}" is undefined`);
        } else if (!ref.value || ref.value.trim() === '') {
            missingFields.push(`${input.label || input.name} is required`);
        }
    });
    
    // Check select references
    const selectRefs = [
        { 
            name: select_def.select_title_options.name, 
            label: select_def.select_title_options.label || 'Title' 
        },
        { 
            name: select_def.select_specialty_options.name, 
            label: select_def.select_specialty_options.label || 'Specialty' 
        }
    ];
    
    selectRefs.forEach((select) => {
        const ref = selectBoxsRef.current[select.name];
        
        if (!ref) {
            missingFields.push(`Select reference for "${select.name}" is undefined`);
        } else if (!ref.value || ref.value.trim() === '') {
            missingFields.push(`${select.label} is required`);
        }
    });
    
    return {
        isValid: missingFields.length === 0,
        message: missingFields.length > 0 
            ? `Missing or empty fields:\n${missingFields.join('\n')}` 
            : 'All fields are valid',
        missingFields
    };
}
  
  return (
    <>
      <div className={styles["register"]}>
        <div className={styles["center"]}>
          <h1>EMS - Register</h1>
          <Form 
          form_handler={register_handler} 
          fieldDefinitions={{inputs_info,select_def}}
          formBtnState = {formBtnState} 
          references={{inputsBoxsRef , selectBoxsRef}} 
          formKind={"register_form"}/>
        </div>
      </div>
    </>
  );
}


