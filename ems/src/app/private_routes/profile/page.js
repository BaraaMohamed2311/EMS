"use client"
import styles from "./profile.module.css"
import private_routes from "../page";
import { useUserDataContext } from "@/contexts/user_data";
import { useEffect, useState  , useRef} from "react";
import Image from "next/image";
import updateImg from "@/utils/updateImg";
import pickRoleIcon  from "@/utils/pickRoleIcon";
import { useIsLoginContext } from "@/contexts/isLogin";
import Link from "next/link";
import getUserImage from "@/utils/getUserImg";
import MoneyShortner from "@/utils/MoneyShortner"
import {profileComponents} from "./Profile_Fields";
function ProfilePage() {
  

  let {user_data} = useUserDataContext();
  let [blobURL , setBlobURL] = useState("/avatar.jpg");
  let { isLogin } = useIsLoginContext(); 
  const ProfileComponent = profileComponents[user_data.emp_title?.toLowerCase()] || profileComponents.employee;



  // fetch on first render if wasn't stored in  
  useEffect(()=>{
      // fetch image
      getUserImage('/files/profile', user_data.user_id ,user_data.token ,setBlobURL )
    
} ,[user_data.user_email,user_data.token])


  function handleImginput(e){
    updateImg(e.target.files[0] , user_data.user_id , setBlobURL , user_data.token)
  }




  
  // user_data.emp_perms is stored as set not a string that's why we need to convert to array first to loop through
  const permissions = user_data.emp_perms ? Array.from(user_data.emp_perms) : [];

  
  return (
    <main className={"page-main"} >
      <div className={"page-container"}>
        <div className={"main-content"}>
            <div className={"avatar-wrapper"}>
              <input onChange={handleImginput}  className={styles["profile-input"]} name="emp_img" accept="image/*" type="file" />
              <Image priority={true}  src={blobURL} className={"avatar"} width="192" height="192" alt="User Profile Image" />
            </div>
            
          <ProfileComponent user_data={user_data}  permissions={permissions}/>
        </div>
      </div>
      </main>
  );
}


export default  private_routes(ProfilePage)