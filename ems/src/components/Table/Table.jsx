"use client"
import * as React from 'react';
import Table from '@mui/joy/Table';
import { useEffect  , useState} from "react";
import {useCachedEmployeesContext} from "../../contexts/cached_employees"
import styles from "./table.module.css"
import userNotification from '@/utils/userNotification';
import { useRouter } from 'next/navigation';
import stringifyFields from '@/utils/stringifyFields';
import statusNotification from "@/utils/statusNotification"
import { useUserDataContext } from '@/contexts/user_data';
export default function BasicTable({currPage , setCurrPage , sizeOfPage , isFiltered , filteredResults}) {

  let [ isSmallScreen , setIsSmallScreen ] = useState(false);
  let [numOfPages , setNumOfPages] = useState(1);
  const router = useRouter()
  const {user_data} = useUserDataContext();
  let {cached_employees , setCached_Employees} = useCachedEmployeesContext();


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


  // Fetching
  useEffect(()=>{
    // We only fetch if next page not cached nor filtered cuz filtered result dont get cached
    if(!((cached_employees.length / sizeOfPage ) > (currPage - 1)) && !isFiltered){
    fetch(`${process.env.APIKEY}/list/employees?emp_id=${user_data.emp_id}&pagination=${currPage}&size=${sizeOfPage}`,{
      mode:"cors",
      headers:{
            Authorization: `BEARER ${user_data.token}`,
            'Content-Type': 'application/json'
      }
    }).then(res=>{

      statusNotification(res.status);
      return res.json();
    })
    .then(data=>{
      if(data && data.success){
        setNumOfPages(data.numOfPages || 1);
        
          // if first render just return res array if not push it to previous where previous comes first
          setCached_Employees((prev)=>{

            if(prev.length < 1){
              return data.body
            }
            else{
              return [...prev , ...data.body]
            }
            });
      }
      else if(data && !data.success){
        userNotification("error",data.message)
      }
    })

  }
  }
    ,[currPage])



    function handleVisitBtn(employee){
      const employeeAsQueries = stringifyFields("anded",Object.entries(employee))
      router.replace(`/private_routes/employee/${employee.emp_id}?${employeeAsQueries}&currPage=${currPage}`)
    }


  function handlePagination(e){
    if(e.target.id === 'prev'){
      if(currPage > 1)
        setCurrPage(prev => prev - 1);
    }
    else if(e.target.id === 'next'){
      setCurrPage(prev => prev + 1);
    }
  }



  return (
    <div className={styles.table_wrapper}>
      <Table className={styles.table} aria-label="basic table" 
       sx={{
        '& td, & th': {
          userSelect: 'all', // Apply user-select property to cells
        },
      }}>
        <thead>
          <tr className={styles.table_row} name="headers">
            <th className={styles.table_col_1}>ID</th>
            <th className={styles.table_col_1}>Name</th>
            <th className={styles.table_col_2}>Email</th>
            {!isSmallScreen && <>
              <th className={styles.table_col_2}>Title</th>
              <th className={styles.table_col_2}>Speciality</th>
              <th className={styles.table_col_1}>Salary</th>
              <th className={styles.table_col_1}>Bonus</th>
              <th className={styles.table_col_1}>Absence</th>
              <th className={styles.table_col_1}>Rate</th>
              </>}
              <th className={styles.table_col_1}>Details</th>
              
          </tr>
        </thead>
        <tbody>
                        { /*check if num of pages could be generated is larger or equal to currPage */}
          {!isFiltered && (cached_employees.length / sizeOfPage ) >= (currPage - 1) && cached_employees.slice((currPage-1)* sizeOfPage,currPage * sizeOfPage).map((employee)=>{
            return (
              <tr key={employee.emp_id} className={styles.table_row}>
                <th className={styles.table_col_1}>{employee.emp_id}</th>
                <th className={styles.table_col_1}>{employee.emp_name}</th>
                <th className={styles.table_col_2}>{employee.emp_email}</th>
                <th className={styles.table_col_2}>{employee.emp_title}</th>
                {!isSmallScreen && <>
                <th className={styles.table_col_2}>{employee.emp_specialty}</th>
                <th className={styles.table_col_1}>{employee.emp_salary}</th>
                <th className={styles.table_col_1}>{employee.emp_bonus}</th>
                <th className={styles.table_col_1}>{employee.emp_abscence}</th>
                <th className={styles.table_col_1}>{employee.emp_rate}</th>
                </>}
                <th className={styles.table_col_1}><button onClick={()=>handleVisitBtn(employee)} className={styles["grey-button"]}>Visit</button></th>
              </tr>
            )
          })}
                              { /*we render filter elements if  filtering */}
        {isFiltered &&  filteredResults.length > 0 &&  filteredResults.map((employee)=>{
          
                    return (
                      <tr key={employee.emp_id} className={styles.table_row}>
                        <th className={styles.table_col_1}>{employee.emp_id}</th>
                        <th className={styles.table_col_1}>{employee.emp_name}</th>
                        <th className={styles.table_col_2}>{employee.emp_email}</th>
                        <th className={styles.table_col_2}>{employee.emp_title}</th>
                        {!isSmallScreen && <>
                          <th className={styles.table_col_2}>{employee.emp_specialty}</th>
                          <th className={styles.table_col_1}>{employee.emp_salary}</th>
                          <th className={styles.table_col_1}>{employee.emp_bonus}</th>
                          <th className={styles.table_col_1}>{employee.emp_abscence}</th>
                          <th className={styles.table_col_1}>{employee.emp_rate}</th>
                          </>}
                        <th className={styles.table_col_1}><button onClick={()=>handleVisitBtn(employee)} className={styles["grey-button"]}>Visit</button></th>
                      </tr>
                    )
                  })}
        </tbody>
      </Table>

      <div className={styles.table_btn_wrapper}>
        <button id='prev' onClick={handlePagination} className="table-btn"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <span className='currpage'>{currPage} - {numOfPages}</span>
        <button id='next' onClick={handlePagination} className="table-btn"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      </div>
    </div>

  );
}
