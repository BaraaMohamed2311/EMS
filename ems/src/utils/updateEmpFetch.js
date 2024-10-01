"use client"
import userNotification from "./userNotification";
import statusNotification from "./statusNotification"

export default function updateEmpFetch(url , token , body, actions , setCached_Employees , currPage , router){
    

    fetch(`${process.env.APIKEY}/${url}?actions=${actions}`,{
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
                router.replace("/private_routes/list")
            }
            // if failed then some unauthorized modifications was attempted
            else if (data && !data.success){
                data.messages.forEach((message)=> userNotification("warning", message));
            }
        
    })
    .catch((err)=>{
        console.error("Error Updating Employee Fetch", err)
        userNotification("error","Error Updating Employee Fetch")
    });
}