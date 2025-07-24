
"use client";
import Form from "@/components/Form/Form";
import styles from "./login.module.css";
import {useUserDataContext} from "../../contexts/user_data"
import { useEffect, useRef, useState } from "react";
import inputs_info from "./data";
import userNotification from "@/utils/userNotification";
import { useIsLoginContext } from "@/contexts/isLogin";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  let {user_data , setUser_Data} = useUserDataContext();
  let [formBtnState, setFormBtnState] = useState("Login");
  let [ isLoadingBtn , setIsLoadingBtn ] = useState(false)
  const router = useRouter();

  const {  setIsLogin } = useIsLoginContext()
  // Refrences 

  let inputsBoxsRef = useRef({});

  
  /**************************************/
  function login_handler(event){
    // preventing refresh
    event.preventDefault();
    // sending request 
    // if empty do not send response
    const EMAIL_REF = inputsBoxsRef.current["Email"];
    const PASSWORD_REF = inputsBoxsRef.current["Password"];
    console.log("inputsBoxsRef", inputsBoxsRef.current["Email"].value);
    if(EMAIL_REF.value === "" || PASSWORD_REF.value === "") return userNotification("error","Fields Cannot Be Empty")

      // remove sotored data if user wants to log with new account so if pre stored is not null & different clear localStorage
        if(user_data.emp_email && EMAIL_REF.value !== user_data.emp_email){
           localStorage.clear(); // deletes all including blob url image and user data
        }

        // start loading button
        setIsLoadingBtn(true)
        // Now we log in
        fetch(`${process.env.APIKEY}/user/login`, 
              {
              method:"POST",
              mode:"cors",
              headers: {
                'Content-Type': 'application/json'
              },
              body:JSON.stringify({
                  emp_email:EMAIL_REF.value,
                  password:PASSWORD_REF.value
              })
            }
          )
          .then(res=>res.json())
          .then(data=>{
              if(data.success){
                // we assign user data to context
                const emp_perms = new Set(data.body.emp_perms);
                delete data.body.emp_perms;
                // this ensures we removed old emp_perms array 
                setUser_Data({emp_perms : emp_perms , ...data.body})
                setFormBtnState("Succeded")
                userNotification("success" , data.message)
                // display logout btn 
                setIsLogin(true)

                router.replace("/")
                }
              
              else{

                setFormBtnState("Try Again")
                userNotification("error" , data.message)
              }
              // stop loading button
              setIsLoadingBtn(false)
            })
            .catch(err=>{
              console.error("Error Login",err);
              setIsLoadingBtn(false)
              setFormBtnState("Try Again");
              userNotification("error" , data.message);
              // stop loading button
              
            })
      
  }
  
  return (
    <>
      <div className={styles["login"]}>
        <div className={styles["center"]}>
          <h1>EMS - Login</h1>
          <Form form_handler={login_handler}
                formBtnState = {formBtnState} 
                inputs_info = { inputs_info} 
                formKind={"login_form"}
                setIsLoadingBtn={setIsLoadingBtn}
                isLoadingBtn={isLoadingBtn}
                references ={{inputsBoxsRef:inputsBoxsRef}}
                />
        </div>
      </div>
    </>
  );
}


