
"use client";
import Form from "@/components/Form/Form";
import styles from "./register.module.css";
import { useRef, useState } from "react";
import {inputs_info , select_options} from "./data";
import userNotification from "@/utils/userNotification";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  let [formBtnState, setFormBtnState] = useState("Register");
  let router = useRouter();
 /************ Refrences **************/
  inputs_info.forEach((input) => {
    input.ref = useRef();
  });

  const SelectPOSITION_REF = useRef();
  select_options.select_position_options.ref = SelectPOSITION_REF;
  /**************************************/
  function register_handler(e){
    // preventing refresh
    e.preventDefault();

    // gathering values of body from refrences
    const requestBody ={};
    /******************************/
    inputs_info.forEach((input) => {
      requestBody[input.name]= input.ref.current.value;
    });
    // adding position selection
    requestBody[select_options.select_position_options.name]= select_options.select_position_options.ref.current.value;


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

            userNotification("error" , data.message)
          }
        })
        .catch(err=>{
          console.log("Error Login",err);
          setFormBtnState("Try Again");
          userNotification("error" , data.message)
        })
  }
  
  return (
    <>
      <div className={styles["register"]}>
        <div className={styles["center"]}>
          <h1>EMS - Register</h1>
          <Form form_handler={register_handler} select_options ={select_options} formBtnState = {formBtnState} inputs_info = { inputs_info} formKind={"register"}/>
        </div>
      </div>
    </>
  );
}


