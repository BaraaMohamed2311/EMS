import styles from "./searchoptions.module.css"
import Select from "../Select/Select";
import {  useEffect } from "react";

function SearchOptions({  clearBtn, handleFilterOption, currPage  , selectsElementsData , references}){

    
    useEffect(()=>{
        // filter again for next pages
        handleFilterOption(null ,"currPage" , false);
    },[currPage])
    

    return(
        <div className={styles["table-search-options"]}>
            <input  ref={(el)=>references.inputsBoxsRef.current["Email"]=el} type="email" placeholder="Search Using Email" />
            {selectsElementsData && selectsElementsData.map((selectData )=>{
                return (<Select styles={styles}  key={selectData.key} isLabeld = {false} select_options={selectData} reference={references.selectBoxsRef}/>)
            })}
            <button onClick={(e)=>handleFilterOption(e , "button" , false)} className={`${styles["filter"]} `}>Filter</button>
            <button onClick={clearBtn} className={`${styles["filter"]} `}>Reset</button>
        </div>
    )
}


export default SearchOptions;