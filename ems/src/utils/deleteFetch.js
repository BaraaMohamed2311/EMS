import userNotification from "./userNotification"

export default function deleteFetch(url,token , body){

    fetch(`${process.env.APIKEY}/${url}`,{
        method:"DELETE",
        headers:{
            authorization:`BEARER ${token}`,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    }).then((res)=>res.json())
    .then((data)=>{
        if(data.success){
            return userNotification("success",data.message)
        }

        return userNotification("error",data.message)
    })
    .catch((err)=>{
        consoleLog(`Error Deleting ${err}`, "error")
        return userNotification("error",data.message)
    })
}