
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
    const inputsBoxsRef = useRef({})
    const {userId , resetToken} = useParams();
  
  /**************************************/
  function login_handler(event){
    // preventing refresh
    event.preventDefault();
    // sending request 
    // if empty do not send response
    if(inputsBoxsRef.current["emp_password1"].value  === inputsBoxsRef.current["emp_password2"].value){
    fetch(`${process.env.APIKEY}/user/reset-password/${userId}/${resetToken}`, 
          {
          method:"PUT",
          mode:"cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
              emp_password:inputsBoxsRef.current["emp_password1"].value,
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
                        name:"emp_password1",
                        isRequired:true

                    },{
                        id:"reset_password2",
                        label:"Repeat Password",
                        type:"password",
                        name:"emp_password2",
                        isRequired:true

                    }]} references={{inputsBoxsRef}} formKind={"forget_pass_form"}/>
        </div>
      </div>
    </>
  );
}


