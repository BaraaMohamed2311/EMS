"use client"
import styles from "./registered-approve.module.css"
import private_routes from "../page";
import stringifyFields  from "@/utils/stringifyFields";
import { useEffect, useRef, useState } from "react";
import { useUserDataContext } from "@/contexts/user_data";
import userNotification from "@/utils/userNotification";
import statusNotification from "@/utils/statusNotification"
import { useRouter } from "next/navigation";
import SearchOptions from "@/components/SearchOptions/SearchOptions";
import {  inputs_info} from "./data";
import BasicTable from "@/components/BasicTable/BasicTable";
function RegisteredApprovePage() {


    let [ isSmallScreen , setIsSmallScreen ] = useState(false);
    let [currPage , setCurrPage ] = useState(1);
    let [isFiltered , setIsFiltered]  = useState(false);
    let [filteredResults , setFilteredResults] = useState([]); // as array not Map cuz we will not cache "pageNum":[{},{},...] like we did with cachedContext
    let [registeredUsers , setRegisteredUsers ] = useState([]);
    let [numOfPages , setNumOfPages] = useState(1);
    const sizeOfPage = 12;
    const { user_data} = useUserDataContext();
    const router = useRouter();
    const inputsBoxsRef= useRef({});


    // ===========================================
//        Fetch Registered Users (NO FILTER)
// ===========================================
useEffect(() => {
  if (isFiltered) return;

  fetch(
    `${process.env.APIKEY}/list/registered-approve?modifier_id=${user_data.user_id}&currPage=${currPage}&size=${sizeOfPage}`,
    {
      mode: "cors",
      headers: {
        Authorization: `BEARER ${user_data.token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      statusNotification(res.status);
      return res.json();
    })
    .then((data) => {
      if (data?.success) {
        setRegisteredUsers(data.body);
        setNumOfPages(data.numOfPages || 1);
      } else {
        userNotification("error", data.message);
        setRegisteredUsers([]);
      }
    })
    .catch(() => {
      userNotification("error", "Error fetching registered users");
    });
}, [currPage, isFiltered]);




 
/*********************************************************/


    // ===========================================
//        Filter Registered Users
// ===========================================
function handleFilterOption(e, cause = "button") {
  if (e) e.preventDefault();

  const EMAIL_REF = inputsBoxsRef.current["user_email"];
  const NAME_REF = inputsBoxsRef.current["user_name"];

  const user_email = EMAIL_REF.value || null;
  const user_name = NAME_REF.value || null;

  if (!user_email && !user_name && cause === "button") {
    userNotification("error", "No Filters Entered");
    handleClearFilterOption();
    return;
  }

  let filterPage = currPage;
  if (cause === "button") {
    setCurrPage(1);
    filterPage = 1;
  }

  const filter_queries = stringifyFields(
    "anded",
    Object.entries({ isFiltered: true, user_email, user_name })
  );

  fetch(
    `${process.env.APIKEY}/list/registered-approve?modifier_id=${user_data.user_id}&${filter_queries}&currPage=${filterPage}&size=${sizeOfPage}`,
    {
      mode: "cors",
      headers: {
        Authorization: `BEARER ${user_data.token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      statusNotification(res.status);
      return res.json();
    })
    .then((data) => {
      if (data?.success) {
        setIsFiltered(true);
        setFilteredResults(data.body);
      } else {
        setIsFiltered(false);
        userNotification("error", data.message);
      }
    })
    .catch(() => {
      setIsFiltered(false);
      userNotification("error", "Failed to fetch filtered data");
    });
}

/*********************Action Btns***********************************/
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


  function handleAccept(e,modifier_id ,modifier_email ,  modifier_name , user_name ,user_email){
    e.preventDefault();
    fetch(`${process.env.APIKEY}/list/registered-approve/accept?modifier_id=${modifier_id}&modifier_email=${modifier_email}&modifier_name=${modifier_name}&user_name=${user_name}&user_email=${user_email}`,{
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
  function handleDecline(e,modifier_id ,modifier_email ,  modifier_name , user_name ,user_email){
    e.preventDefault();
    fetch(`${process.env.APIKEY}/list/registered-approve/decline?modifier_id=${modifier_id}&modifier_email=${modifier_email}&modifier_name=${modifier_name}&user_name=${user_name}&user_email=${user_email}`,{
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


// ===========================================
//        Clear Filters
// ===========================================
function handleClearFilterOption() {
  setIsFiltered(false);
  setFilteredResults([]);
  setCurrPage(1);

  inputsBoxsRef.current["user_email"].value = "";
  inputsBoxsRef.current["user_name"].value = "";
}

// ===========================================
//               Responsive Table
// ===========================================

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
  
  return (
    <main className={styles.registered_approve} >
      <SearchOptions 
          references = {{ inputsBoxsRef: inputsBoxsRef }}
          clearBtn = {handleClearFilterOption} 
          handleFilterOption={handleFilterOption} 
          setCurrPage={setCurrPage} 
          currPage={currPage} 
          sizeOfPage={sizeOfPage} 
          setIsFiltered= {setIsFiltered} 
          setFilteredResults={setFilteredResults} 
          fieldDefinitions={{inputs_info}}
          isFiltered={isFiltered}
          />
      <BasicTable 
      currPage={currPage} 
                  sizeOfPage={sizeOfPage}
                  setCurrPage={setCurrPage} 
                  data={registeredUsers} 
                  isFiltered={isFiltered} 
                  filteredResults={filteredResults} 
                  handleActionBtn={null} 
                  numOfPages={numOfPages} 
                  tableType="registered-approve"
                  otherActionBtns={{
                    acceptBtn: (e, row) =>
                      handleAccept(
                        e,
                        user_data.user_id,
                        user_data.user_email,
                        user_data.user_name,
                        row.user_name,
                        row.user_email
                      ),

                    declineBtn: (e, row) =>
                      handleDecline(
                        e,
                        user_data.user_id,
                        user_data.user_email,
                        user_data.user_name,
                        row.user_name,
                        row.user_email
                      )
                  }}
      />
    </main>
  );
}


export default  private_routes(RegisteredApprovePage)