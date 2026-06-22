"use client"
import * as React from 'react';
import Table from '@mui/joy/Table';
import { useEffect  , useState} from "react";
import styles from "./table.module.css"
import {TableColumnsMap , MapTableColumns} from "./Table_Fields"
import Pagination_Btns from "../Pagination_Btns/Pagination_Btns";
export default function BasicTable({currPage,sizeOfPage , setCurrPage ,numOfPages , isFiltered,filteredResults,handleActionBtn  ,data=[] , tableType , otherActionBtns}) {

  let [ isSmallScreen , setIsSmallScreen ] = useState(false);
  const TableColumns = TableColumnsMap[tableType] ||  ((props) => <p>❌ Unknown table type: {tableType}</p>); // Fallback component (Must be a function component, otherwise React will throw an error since it is a .jsx file)

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
      <Table
        className={styles.table}
        aria-label="basic table"
        sx={{ "& td, & th": { userSelect: "all" } }}
      >
        <thead>
          <tr className={styles.table_row}>
            <MapTableColumns tableType={tableType} type="headers" isSmallScreen={isSmallScreen} />
          </tr>
        </thead>
        <tbody>
        {/* We have to return No Data Found when no sliced data*/}
          { data.length > 0 && data.slice((currPage - 1) * sizeOfPage, currPage * sizeOfPage).length === 0 &&
            <tr  className={styles.table_row_no_data}>
              <td>No Data Found</td>
            </tr>
          }

          {/* We have to pass row to each  handleActionBtn to act on targeted user*/}
          {(!isFiltered && data.length > 0) && data.slice((currPage - 1) * sizeOfPage, currPage * sizeOfPage).map((row, indx) => {return (
            <tr key={row.user_id} className={styles.table_row}>
              <MapTableColumns tableType={tableType}
                key={row.user_id}
                type="row"
                isSmallScreen={isSmallScreen}
                row={{indx ,...row}}
                handleActionBtn={(e)=>handleActionBtn(row)}
                otherActionBtns={otherActionBtns}
              />
            </tr>
          )})}

          {(isFiltered && filteredResults.length > 0) && filteredResults.map((row, indx) => (
             <tr key={row.user_id}  className={styles.table_row}>
              <MapTableColumns tableType={tableType}
                key={row.user_id}
                type="row"
                isSmallScreen={isSmallScreen}
                row={{indx ,...row}}
                handleActionBtn={(e)=>handleActionBtn(row)}
                otherActionBtns={otherActionBtns}
              />
            </tr>
          ))}
        </tbody>
      </Table>

      <div className={styles.table_btn_wrapper}>
        <Pagination_Btns handlePagination={handlePagination} currPage={currPage} numOfPages={numOfPages} />
      </div>
    </div>
  );
}
