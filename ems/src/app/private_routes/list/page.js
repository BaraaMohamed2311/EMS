"use client"
import private_routes from "../page";
import { Suspense , lazy ,useState , useRef} from "react";
import LoaderForComponents from "@/components/LoaderForComponents/LoaderForComponents";
import SearchOptions from "@/components/SearchOptions/SearchOptions";
import styles from "./list.module.css"
import selectsElementsData from "./data";
import userNotification from "@/utils/userNotification";
import stringifyFields from "@/utils/stringifyFields";
import statusNotification from "@/utils/statusNotification";
import { useUserDataContext } from "@/contexts/user_data";
import Table from '@/components/Table/Table';
function ListPage() {
  

  const {user_data} = useUserDataContext()
  
  // for filtering
  let [isFiltered , setIsFiltered]  = useState(false);
  let [filteredResults , setFilteredResults] = useState([]); // as array not Map cuz we will not cache "pageNum":[{},{},...] like we did with cachedContext
  // 
  let [currPage , setCurrPage ] = useState(1);
  const sizeOfPage = 15;


  // Refrences
  const ByPositionREF = useRef();
  const ByRoleREF = useRef();
  const ByPermsREF = useRef();
  const EMAILREF = useRef();

  // assigning refrence to selectsElementsData to assign it to ref attribute of each SELECT element rendered
  selectsElementsData[0].ref = ByPositionREF;
  selectsElementsData[1].ref = ByRoleREF;
  selectsElementsData[2].ref = ByPermsREF;

  function handleClearFilterOption(){
        
    setIsFiltered(false) // set to false to render cached employees with no filters
    setFilteredResults([]); //to remove all
    setCurrPage(1);

    // reset select filters back to no filter
    EMAILREF.current.value = ""
    ByPositionREF.current.value = "Position Filter";
    ByRoleREF.current.value =  "Role Filter";
    ByPermsREF.current.value =  "Perms Filter";
}

function handleFilterOption(e , cause){
    if(e) e.preventDefault();
    // get filter inputs 
    const emp_email = EMAILREF.current.value === "" ? null : EMAILREF.current.value;
    const role_name = ByRoleREF.current.value === "Role Filter" ? null : ByRoleREF.current.value;
    const emp_position = ByPositionREF.current.value === "Position Filter" ? null : ByPositionREF.current.value;
    const emp_perms = ByPermsREF.current.value === "Perms Filter" ? null : ByPermsREF.current.value;

    // making sure this checking is applied when only pressing btn 
    if(!emp_email && !role_name && !emp_position && !emp_perms && cause === "button"){
        userNotification("error","No Filters Entered");
        handleClearFilterOption(); // resets if no filtering specified
        return; // to escape rest of the function
    }

    // reset page to 1 when filtering
    if(  cause   === "button")
        setCurrPage(1)

    // we use stringifyFields function to exclude null values and do not add as query also join them
    const filter_queries = stringifyFields("anded",Object.entries({emp_email : emp_email , role_name:role_name , emp_position:emp_position , emp_perms: emp_perms}))
    
    // fetching data on filter 
    fetch(`${process.env.APIKEY}/list/employees?emp_id=${user_data.emp_id}&${filter_queries}&pagination=${currPage}&size=${sizeOfPage}`,{
        mode:"cors",
        headers:{
            Authorization: `BEARER ${user_data.token}`,
            'Content-Type': 'application/json'
      }
    })
    .then(res=>{
          statusNotification(res.status)  
          return res.json();
    })
    .then(data=>{
        if(data && data.success){
            setIsFiltered(true)
            setFilteredResults(data.body); //to remove previous cached and cache filtered users
        }
        else if(data && !data.success) {
            setIsFiltered(false); // if failed then we display regular cached_employees by setting back to false
            userNotification("error",data.message)
        }
    })
    .catch(err=>{
        setIsFiltered(false); // if failed then we display regular cached_employees by setting back to false
        userNotification("error",data.message)
    })
}



  
  return (
    <main className={`${styles["list"]} wrapper`}>
      <SearchOptions EMAILREF={EMAILREF} clearBtn = {handleClearFilterOption} handleFilterOption={handleFilterOption} setCurrPage={setCurrPage} currPage={currPage} sizeOfPage={sizeOfPage} setIsFiltered= {setIsFiltered} setFilteredResults={setFilteredResults} selectsElementsData={selectsElementsData}/>
      <Suspense fallback={<LoaderForComponents  styling={styles.loader_for_components_wrapper}/>}>
        <Table currPage={currPage} setCurrPage={setCurrPage} sizeOfPage={sizeOfPage} isFiltered={isFiltered} filteredResults={filteredResults}/>
      </Suspense>
    </main>
  );
}

export default  private_routes(ListPage)