
"use client";
import Form from "@/components/Form/Form";
import styles from "./forget-password.module.css";
import {useRef ,  useState } from "react";
import userNotification from "@/utils/userNotification";


export default function ForgetPasswordPage() {
    let [formBtnState, setFormBtnState] = useState("Request Link");

  
    let inputsBoxsRef = useRef({});
  /**************************************/
  function login_handler(event){
    // preventing refresh
    event.preventDefault();
    // sending request 
    // if empty do not send response
    
    fetch(`${process.env.APIKEY}/user/forget-password`, 
          {
          method:"POST",
          mode:"cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
              emp_email:EMAIL_REF.current.value,
          })
        }
      )
      .then(res=>res.json())
      .then(data=>{
          if(data.success){
            // we assign user data to context
            setFormBtnState("Chech Your Gmail")
            userNotification("success" , data.message);

            }
          
          else{
            setFormBtnState("Try Again")
            userNotification("error" , data.message)
          }
        })
        .catch(err=>{

          setFormBtnState("Try Again");
          userNotification("error" , data.message)
        })
  }
  
  return (
    <>
      <div className={styles["forget-password"]}>
        <div className={styles["center"]}>
          <h1>Email Check</h1>
          <Form 
            form_handler={login_handler} 
            formBtnState = {formBtnState} 
            inputs_info = { [{
                        id:"forget_password",
                        label:"Type Your Email",
                        type:"email",
                        isRequired:true

                    }]} 
            formKind={"forget_pass_form"}
            references ={{inputsBoxsRef:inputsBoxsRef}}
            />
        </div>
      </div>
    </>
  );
}


