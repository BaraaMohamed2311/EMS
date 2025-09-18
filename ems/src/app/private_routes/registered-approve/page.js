"use client"
import styles from "./registered-approve.module.css"
import private_routes from "../page";
import { Table ,Sheet} from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { useUserDataContext } from "@/contexts/user_data";
import userNotification from "@/utils/userNotification";
import statusNotification from "@/utils/statusNotification"
import { useRouter } from "next/navigation";
import SearchOptions from "@/components/SearchOptions/SearchOptions";
function RegisteredApprovePage() {


  let [ isSmallScreen , setIsSmallScreen ] = useState(false);

  useEffect(()=>{
    // check responsibility on first render
    ResponsiveTable()

    window.addEventListener("resize",ResponsiveTable );

    function ResponsiveTable(){
      if( window.innerWidth <= 1200){
        setIsSmallScreen(true)
      }
      else{
        setIsSmallScreen(false)
      }
  }

    return ()=>{
      window.removeEventListener("resize",ResponsiveTable )
    }
  },[])


 
/*********************************************************/
    let [currPage , setCurrPage ] = useState(1);
    let [registeredUsers , setRegisteredUsers ] = useState([]);
    const sizeOfPage = 12;
    const { user_data} = useUserDataContext();
    const router = useRouter();
    const inputsBoxsRef= useRef({});

    useEffect(()=>{
      Fetch_UnRegistered_Users(null , null , true);
    },[currPage])

    // we skip parameter 1 and 2 checkout searchOptions component
    function Fetch_UnRegistered_Users( p1 , p2  , isFirstRender = false){
      fetch(`${process.env.APIKEY}/list/registered-approve?modifier_id=${user_data.emp_id}${isFirstRender ? "" : `&filtered_emp_email=${inputsBoxsRef.current["Email"].value}`  }&currPage=${currPage}&size=${sizeOfPage}`,{
        mode:"cors",
        headers:{
              Authorization: `BEARER ${user_data.token}`,
              'Content-Type': 'application/json'
        }
      })
      .then((res)=>{

        statusNotification(res.status)

        return res.json();
      })
      .then((data)=>{
        if(data.success){
          userNotification("success",data.message);
          setRegisteredUsers(data.body);
        }
        else{
          userNotification("error",data.message);
          setRegisteredUsers([]);
        }
      })
      .catch((err)=>{
        userNotification("error","Error Fetchin Register Table Data")
      })
    }

    // handlePagination
  function handlePagination(e){
    if(e.target.id === 'prev'){
      if(currPage > 1)
        setCurrPage(prev => prev - 1);
    }
    else if(e.target.id === 'next'){
      setCurrPage(prev => prev + 1);
    }
  }
/********************************************************/

  function handleAccept(e,modifier_id ,modifier_email ,  modifier_name , emp_name ,emp_email){
    e.preventDefault();
    fetch(`${process.env.APIKEY}/list/registered-approve/accept?modifier_id=${modifier_id}&modifier_email=${modifier_email}&modifier_name=${modifier_name}&emp_name=${emp_name}&emp_email=${emp_email}`,{
      mode:"cors",
      method:"POST",
      headers:{
            Authorization: `BEARER ${user_data.token}`,
            'Content-Type': 'application/json'
      }
    })
    .then((res)=>{
      statusNotification(res.status)
      
      
      return res.json();
    })
    .then((data)=>{
      if(data.success){
        userNotification("success",data.message);
        setRegisteredUsers(data.body);
        router.refresh();
      }
      else{
        userNotification("error",data.message)
      }
    })
    .catch((err)=>{
      userNotification("error","Error Fetchin Register Table Data")
    })
  }
/********************************************************/
  function handleDecline(e,modifier_id ,modifier_email ,  modifier_name , emp_name ,emp_email){
    e.preventDefault();
    fetch(`${process.env.APIKEY}/list/registered-approve/decline?modifier_id=${modifier_id}&modifier_email=${modifier_email}&modifier_name=${modifier_name}&emp_name=${emp_name}&emp_email=${emp_email}`,{
      mode:"cors",
      method:"DELETE",
      headers:{
            Authorization: `BEARER ${user_data.token}`,
            'Content-Type': 'application/json'
      }
      
    })
    .then((res)=>{
      statusNotification(res.status)
      
      
      return res.json();
    })
    .then((data)=>{
      if(data.success){
        userNotification("success",data.message);
        setRegisteredUsers(data.body);
        router.refresh(); // refreshes current page to see updated users
      }
      else{
        userNotification("error",data.message)
      }
    })
    .catch((err)=>{
      userNotification("error","Error Fetchin Register Table Data")
    })
  }


  async function handleClearFilterOption(){

    await setRegisteredUsers([]); //to remove all
    Fetch_UnRegistered_Users(null , null , true);
    // reset select filters back to no filter
    inputsBoxsRef.current["Email"].value = ""
}
  
  return (
    <main className={styles.registered_approve} >
      <SearchOptions  references = {{ inputsBoxsRef: inputsBoxsRef }} clearBtn ={handleClearFilterOption} handleFilterOption={Fetch_UnRegistered_Users} currPage={currPage} />
      <Sheet
      variant="solid"
      invertedColors
      sx={() => ({
        pt: 1,
        borderRadius: 'sm',
        transition: '0.3s',
        background: `#212121`,
        '& tr:last-child': {
          '& td:first-of-type': {
            borderBottomLeftRadius: '8px',
          },
          '& td:last-child': {
            borderBottomRightRadius: '8px',
          },
        },
      })}
    >

        <Table className={styles.table} aria-label="basic table"
         stripe="odd"
         hoverRow
         sx={{ captionSide: 'top', '& tbody': { bgcolor: 'background.surface'   },
         '& td, & th': {
          userSelect: 'all', 
        }, }}>
        <thead>
          <tr className={styles.table_row + ' ' + styles.tr} name="headers">
            <th className={styles.table_col_1 + ' ' + styles.th}>Name</th>
            <th className={styles.table_col_2 + ' ' + styles.th}>Email</th>
            {!isSmallScreen && <th className={styles.table_col_2 + ' ' + styles.th}>Position</th>}
            <th className={styles.table_col_1 + ' ' + styles.th}></th>
            <th className={styles.table_col_1 + ' ' + styles.th}></th>
          </tr>
        </thead>
        <tbody>
                        { /*we render cached unfiltered elements if no filtering */}
          {registeredUsers && registeredUsers.length > 0 && registeredUsers.map((employee)=>{
            return (
              <tr key={employee.emp_id} className={styles.table_row + ' ' + styles.tr}>
                <th className={styles.table_col_1 + ' ' + styles.th}>{employee.emp_name}</th>
                <th className={styles.table_col_2 + ' ' + styles.th}>{employee.emp_email}</th>
                {!isSmallScreen && <th className={styles.table_col_2 + ' ' + styles.th}>{`${employee.emp_title} | ${employee.emp_specialty}`}</th>}

                <th className={styles.table_col_1 + ' ' + styles.th}>
                  <button onClick={(e)=>handleAccept(e,user_data.emp_id ,user_data.emp_email ,  user_data.emp_name , employee.emp_name , employee.emp_email )} className={`green-button`}>
                    Accept
                  </button>
                </th>

                <th className={styles.table_col_1 + ' ' + styles.th}><button onClick={(e)=>handleDecline(e,user_data.emp_id ,user_data.emp_email ,  user_data.emp_name , employee.emp_name , employee.emp_email)} className={`red-button`}>Decline</button></th>
              </tr>
            )
          })}

        </tbody>
      </Table>
      </Sheet>
      <div className={styles.table_btn_wrapper}>
        <button id='prev' onClick={handlePagination} className="table-btn"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <span className='currpage'>{currPage}</span>
        <button id='next' onClick={handlePagination} className="table-btn"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      </div>
    </main>
  );
}


export default  private_routes(RegisteredApprovePage)