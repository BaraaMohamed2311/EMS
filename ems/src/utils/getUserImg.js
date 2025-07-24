import statusNotification from "./statusNotification";
import userNotification from "./userNotification";

export default function getUserImage(url , emp_email , reader ,setBlobURL , token){

    fetch(`${process.env.APIKEY}${url}?emp_email=${emp_email}`,{
      mode:"cors",
       headers:{
        Authorization: `BEARER ${token}`
    }
  })
    .then(async (res)=>{
      
        statusNotification(res.status);
        // if response has type set and equal to application/json then parse & if not use blob()
        if(res.headers.get("Content-Type")?.split(";")[0] === "application/json"){
          return {type:"application/json" , res : await res.json()};
        }
        else{
          return {type:"image" , res : await res.blob()};
        } 
    })
      .then(async (data)=>{
        // stop executing and send notification message if type is json
        if(data.type === "application/json"){
          return userNotification("warning",data.res.message);
        }
        // if not then create blob object of image
        if(data.res && data.res.size > 0){

            reader.readAsDataURL(data.res);
          }
          else {
            setBlobURL("/avatar.jpg"); // empty it to display avatar
        }
      })
      .catch(err => {
        return userNotification("error","Error Get User Image");
      })

  

}