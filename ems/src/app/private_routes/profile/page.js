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

function ProfilePage() {
  

  let {user_data} = useUserDataContext();
  let [blobURL , setBlobURL] = useState("/avatar.jpg");
  let { isLogin } = useIsLoginContext(); 



  // fetch on first render if wasn't stored in localStorage 
  useEffect(()=>{
    // we fetch cached in localStorage if nothing then we fetch from db
    const initial = localStorage.getItem("blobURL") ? JSON.parse(localStorage.getItem("blobURL")) : "/avatar.jpg";
    
    
    const reader = new FileReader();

    // if we are rendering default avatar then fetch user's image
    if(initial === "/avatar.jpg"){
      
      // create fileReader to read image once recieved from res
      reader.addEventListener('load',()=> CacheImageLocalStorage(reader.result));
      // fetch image
      getUserImage('/profile/prof-img', user_data.emp_email , reader ,setBlobURL ,user_data.token )
    }

    return ()=>{
      reader.removeEventListener('load', CacheImageLocalStorage)
    }

} ,[user_data.emp_email,user_data.token])


  function handleImginput(e){
    updateImg(e.target.files[0] , user_data.emp_email , setBlobURL , user_data.token)
  }


  function CacheImageLocalStorage(reader_result){
      if(blobURL && blobURL !== "/avatar.jpg")
        localStorage.setItem('blobURL', JSON.stringify(reader_result));
      setBlobURL(reader_result);
  }
  
  // user_data.emp_perms is stored as set not a string that's why we need to convert to array first to loop through
  const permissions = user_data.emp_perms ? Array.from(user_data.emp_perms) : [];

  
  return (
    <main className={styles["profile-main"]} >
      <div className={styles["profile-container"]}>
        <div className={styles["profile-header"]}>
            <div className={styles["profile-img-wrapper"]}>
              <input onChange={handleImginput}  className={styles["profile-input"]} name="emp_img" accept="image/*" type="file" />
              <Image priority={true}  src={blobURL} className={styles["profile-picture"]} width="192" height="192" alt="User Profile Image" />
            </div>

          <div className={styles["profile-info"]}>
              <h1 className={styles["profile-name"]}>{user_data.emp_name}</h1>
              <p className={styles["profile-position"]}>{`${user_data.emp_title} | ${user_data.emp_specialty}` || "No Assigned Position"}</p>
              <p><strong>Email:</strong> {user_data.emp_email}</p>
              <p><strong>Location:</strong> {user_data.emp_address || "Not Specified"}</p>
              <p><strong>Member Since:</strong> {user_data.emp_joined || "Not Specified"}</p>
            </div>
        </div>  

        <div className={styles["profile-details"]}>
          <ul className={styles["activity-list"]}>
          <li><strong>Salary:</strong>{MoneyShortner(user_data.emp_salary)}</li>
            <li><strong>This Month Bonus:</strong>{MoneyShortner(user_data.emp_bonus)}</li>
            <li><strong>This Month Absence:</strong>{user_data.emp_abscence}</li>
            <li className={styles.role_box}><strong>Role : </strong>{user_data.role_name} <Image src={pickRoleIcon(user_data.role_name)} width={"30"} height={"30"} alt="profile user role icon" /></li>
            <li className={styles.perms_box}><strong className={styles.perms_header}>Permissions </strong><div className={styles.perms_wrapper}>
            {permissions[0] !== "None" ?(permissions.map((perm)=>{

              return <span key={perm} className="perm">{perm}</span>
              })) : "None"
                }
              </div></li>
            <li className={`${styles["buttons-wrapper"]}`}>
              {/* we hide request edit butto cuz users with higher role can update their info from dashboard */}
              {user_data.role_name === "Employee" && <Link href={"/private_routes/mailer?subject=Edit Data Request"}style={{ textAlign:"center"}}  className={`grey-button`}>Edit Request</Link>}
              <Link href={"/private_routes/mailer?subject=Retirement Request"} style={{ width: user_data.role_name === "Employee" ? "fit-content" : "100%"  ,textAlign:"center"}}   
                className={`red-button`}>Retire Request</Link>
            </li>
          </ul>
        </div>
      </div>
      </main>
  );
}


export default  private_routes(ProfilePage)