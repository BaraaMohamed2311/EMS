"use client"
import userNotification from "@/utils/userNotification";
import styles from "./mailer.module.css";
import { useUserDataContext } from "@/contexts/user_data";

import { useRef , useState} from "react";
import MailerForm from "@/components/MailerForm/MailerForm";

export default function MailerPage() {
    let [ isLoadingBtn , setIsLoadingBtn ] = useState(false);
    const {user_data} = useUserDataContext()
    const SendTo_REF = useRef();
    const Subject_REF = useRef();
    const TEXT_REF = useRef();
    console.log("styles styles",styles)
    function handleSubmitEmail(e){
        e.preventDefault();

        setIsLoadingBtn(true);

        fetch(`${process.env.APIKEY}/mail/mail-employee`,{
            method:"POST",
            body:JSON.stringify({
                SendFrom: user_data.emp_email,
                SendTo: SendTo_REF.current.value,
                subject:Subject_REF.current.value ,
                text:TEXT_REF.current.value
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            mode:'cors'
        })
        .then((res)=> res.json()) 
        .then(data => 
            { 
                if(data.success){
                    userNotification("success",data.message)
                }
                else{
                    userNotification("error",data.message)
                }
                setIsLoadingBtn(false)
            
        }).catch(err => {

            userNotification("error",err.message)
            setIsLoadingBtn(false);
        });


        }
    
  
  return (
    <div className={styles.mailer_page}>
        <div className={styles.container}>
            <h1>Mailer</h1>
            <MailerForm 
            refrences={{SendTo_REF ,Subject_REF ,  TEXT_REF }}  
            handleSubmitEmail={handleSubmitEmail}  
            styles={styles} 
            isLoadingBtn={isLoadingBtn} />
        </div>

    </div>
  );
}


