
"use client";
import Form from "@/components/Form/Form";
import styles from "./reset-password.module.css";
import {useRef ,  useState } from "react";
import userNotification from "@/utils/userNotification";
import { useParams, useRouter } from "next/navigation";

export default function ForgetPasswordPage() {
    let [formBtnState, setFormBtnState] = useState("Reset Password");
    const router = useRouter();
    const PASS1_REF = useRef();
    const PASS2_REF = useRef();
    
    const {userId , resetToken} = useParams();
  
  /**************************************/
  function login_handler(event){
    // preventing refresh
    event.preventDefault();
    // sending request 
    // if empty do not send response
    if(PASS1_REF.current.value  === PASS2_REF.current.value){
    fetch(`${process.env.APIKEY}/user/reset-password/${userId}/${resetToken}`, 
          {
          method:"PUT",
          mode:"cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
              emp_password:PASS1_REF.current.value,
          })
        }
      )
      .then(res=>res.json())
      .then(data=>{
          if(data.success){
            // we assign user data to context
            setFormBtnState("Success")
            userNotification("success" , data.message);
            router.replace("/private_routes/profile"); // navigate to reset password page
            }
          
          else{
            setFormBtnState("Try Again")
            userNotification("error" , data.message)
          }
        })
        .catch(err=>{
          console.log("Error Login",err);
          setFormBtnState("Try Again");
          userNotification("error" , data.message)
        })
    }
    else{// if passwords do not match
        userNotification("error" , "Passwords Don't Match")
    }
  }
  
  return (
    <>
      <div className={styles["reset-password"]}>
        <div className={styles["center"]}>
          <h1>Reset Password</h1>
          <Form form_handler={login_handler} formBtnState = {formBtnState} inputs_info = { [{
                        id:"reset_password1",
                        label:"New Password",
                        type:"password",
                        ref: PASS1_REF,
                        isRequired:true

                    },{
                        id:"reset_password2",
                        label:"Repeat Password",
                        type:"password",
                        ref: PASS2_REF,
                        isRequired:true

                    }]} formKind={"forget_pass_form"}/>
        </div>
      </div>
    </>
  );
}


