// hooks/useEmployeesCache.js
import { useState, useEffect } from "react";
import { getAllFromStore } from "@/utils/indexDB/getCacheMethods";
import { putIndexDB } from "@/utils/indexDB/updateCacheMethods";
import { clearStore , deleteRecordById} from "@/utils/indexDB/deleteCacheMethods";

export const useEmployeesCache = () => {
  const [cached_employees, setCached_Employees] = useState([]);
  const [fetched_employee_pages, setFetched_Employee_Pages] = useState(new Set());
  const [isIndexedDBLoaded, setIsIndexedDBLoaded] = useState(false);

  // Load from IndexedDB
  useEffect(() => {
  (async () => {
    try {

      const storedEmployees = await getAllFromStore("employees");
      setCached_Employees(storedEmployees);
      setIsIndexedDBLoaded(true);

    } catch (err) {
      console.error("Failed to load employees from IndexedDB:", err);
    }
  })();
}, []);


  // Load fetched pages from localStorage
  useEffect(() => {
    try {
      const storedPages = localStorage.getItem("fetched_employee_pages");
      if (storedPages && storedPages !== "undefined" && storedPages !== "null") {
        const parsedPages = JSON.parse(storedPages);
        if (Array.isArray(parsedPages)) {
          setFetched_Employee_Pages(new Set(parsedPages));
        } else {
          localStorage.removeItem("fetched_employee_pages");
        }
      }
    } catch (err) {
      console.error("Failed to parse fetched_employee_pages:", err);
      localStorage.removeItem("fetched_employee_pages");
    }
  }, []);

  // Persist fetched pages
  useEffect(() => {
    try {
      if (fetched_employee_pages && fetched_employee_pages.size > 0) {
        localStorage.setItem(
          "fetched_employee_pages",
          JSON.stringify([...fetched_employee_pages])
        );
      } else {
        localStorage.removeItem("fetched_employee_pages");
      }
    } catch (err) {
      console.error("Failed to save fetched_employee_pages:", err);
    }
  }, [fetched_employee_pages]);

  // Save employees to IndexedDB
  const saveEmployeesToStore = async (employees) => {
    try {
      if (Array.isArray(employees) && employees.length > 0) {
        await putIndexDB("employees", employees);
      } else {
        await clearStore("employees");
      }
    } catch (err) {
      console.error("Failed to save employees to IndexedDB:", err);
      throw err;
    }
  };

   // Check if a specific page needs sync
  const checkPageSync = async ( max_version ) => {

    try {
      const response = await fetch(`${process.env.APIKEY}/sync/employees?max_version=${max_version}`);
      const data = await response.json();


      return {needsSync : data.needsSync , latest_version:data.latest_version}; 
    } catch (err) {
      console.error("Failed to check page sync:", err);
      return {needsSync : true, latest_version:0}; 
    }
  };

  // Save employees to IndexedDB
  const deleteEmployeeFromStore = async (emp_id) => {
    try {
      // delete specific employee by id from IndexedDB and from state
        await deleteRecordById("employees", emp_id);
        setCached_Employees((prev) => prev.filter(emp => emp.user_id !== emp_id));

    } catch (err) {
      console.error("Failed to delete employee to IndexedDB:", err);
      throw err;
    }
  };

  return {
    cached_employees,
    setCached_Employees,
    fetched_employee_pages,
    setFetched_Employee_Pages,
    saveEmployeesToStore,
    isIndexedDBLoaded,
    setIsIndexedDBLoaded,
    checkPageSync,
    deleteEmployeeFromStore
  };
};