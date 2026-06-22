import userNotification from "./userNotification";

export default function updateImg(image_file ,user_id , setBlobURL , token){
  const mimetypes = new Set(["image/jpeg" ,"image/JPEG" , "image/png" , "image/jpg" , "image/JPG" , "image/PNG"]);
  const maxSizeInBytes = 20 * 1024 * 1024; // 20MB


  // first validate type then size
  if(!mimetypes.has(image_file.type)  ) return userNotification("error","Image Type Must Be jpg or png");
  
  if(image_file.size >maxSizeInBytes) return userNotification("error","Image Size Must be Smaller Than 50Kbs");
  

  
  // Valid image updating
    let formData = new FormData();
    formData.append("user_pic",image_file);
    
    fetch(`${process.env.APIKEY}/files/profile/?user_id=${user_id}`,{
        method:"PUT",
        mode:"cors",
        headers:{
          Authorization: `Bearer ${token}`
        },
        body:formData
    })
    .then(async (res)=>{
        // if response has type set and equal to application/json then parse & if not use blob()
        if(res.headers.get("Content-Type")?.split(";")[0] === "application/json"){
            return {type:"application/json" , res : await res.json()};
          }else{
            return {type:"image" , res : await res.blob()};
          } 
    }) 
    .then(async (data)=>{

        // stop executing and send notification message if type is json
        if(data.type === "application/json"){
           return userNotification("error",data.res.message);
        }
        // if not then create blob object of image
        if(data.res && data.res.size > 0){
          
          await setBlobURL((prev)=>{
                if(prev){
                  URL.revokeObjectURL(prev)
                }

                return URL.createObjectURL(data.res)
            });
            
          } else {
              setBlobURL("/avatar.jpg"); // empty it to display avatar
          }

    })
    .catch((err)=>{

        userNotification("error","Error Fetching Image")
    })


}