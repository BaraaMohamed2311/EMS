import userNotification from "./userNotification";
import statusNotification from "@/utils/statusNotification"
export default function checkToken(token , setIsValid , setIsLoading ){
    
    fetch(`${process.env.APIKEY}/user/private-route`,{
        method:"POST",
        mode:"cors",
        headers:{
            Authorization: `BEARER ${token}`,
            'Content-Type': 'application/json'
        }
    }).then((res)=>{
        statusNotification(res.status);
        return res.json()
    })
    .then( (data)=>{

        
        if(data.success){
            setIsValid(true);
            userNotification("success",data.success);
        }
        else{
            setIsValid(false);
            userNotification("error",data.success);
        }

        setIsLoading(false)

    }).catch((err)=>{

        setIsValid(false);
        setIsLoading(false)
        userNotification("error", "Error Accessing Private Routes")
    })

}