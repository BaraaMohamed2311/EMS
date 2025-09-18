"use client"
import userNotification from "./userNotification";
import statusNotification from "./statusNotification"

export default function updateEmpFetch(url , token , body, actionsString , setCached_Employees , currPage , router){
    

    fetch(`${process.env.APIKEY}/${url}?actions=${actionsString}`,{
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
        console.log("data after updating employee")
            if(data && data.success){
                await  setCached_Employees(prev => {
                    // prevent direct modify
                    let newArray = Array.from(prev);

                    return newArray.map((employee)=>{
                        // if onl updated employee return body response
                        if(data.body.emp_id !== employee.emp_id ){
                            return employee;
                        }
                        else{
                            return data.body;
                        }
                    })
                    
                })
                
                data.messages.forEach((messageObj)=> userNotification(messageObj.success ?"success" : "error", messageObj.message));
                router.replace("/private_routes/list");
                
            }
            
            router.replace("/login");
        
    })
    .catch((err)=>{
        console.error("Error Updating Employee Fetch", err)
        userNotification("error","Error Updating Employee Fetch")
    });
}