"use client"
import userNotification from "./userNotification";
import statusNotification from "./statusNotification"
import {updateRecordByProp} from "@/utils/indexDB/updateCacheMethods"
export default function updateUserFetch(url , token , body, actionsString ){
    

    fetch(`${process.env.APIKEY}/${url}?perms_requested=${actionsString}`,{
        mode:"cors",
        method:"PUT",
        headers:{
            authorization:`BEARER ${token}`,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    }).then((res)=>{
        statusNotification(res.status)
        return res.json()
    })
    .then(async (data)=>{
            data.messages.forEach((messageObj)=> userNotification(messageObj.success ?"success" : "error", messageObj.message));
        
    })
    .catch((err)=>{
        console.error("Error Updating Employee Fetch", err)
        userNotification("error","Error Updating Employee Fetch")
    });
}