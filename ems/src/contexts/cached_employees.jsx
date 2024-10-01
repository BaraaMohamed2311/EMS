"use client";
import { createContext, useContext, useState, useEffect } from "react";

let cached_employees_context = createContext();

let useCachedEmployeesContext = function() {
  return useContext(cached_employees_context);
};

function CachedEmployeesProvider({ children }) {
  // Retrieve initial values from localStorage
  const initial_values =  [];

  // State to store cached employees
  let [cached_employees, setCached_Employees] = useState(initial_values);

  useEffect(() => {
    // if it has at least first page cached then we fetch from local
      const storedData = localStorage.getItem("cached_employees");
      if (storedData) {
        setCached_Employees(JSON.parse(storedData));
      }
  }, []);

  useEffect(() => {
    console.log("cached_employees",cached_employees)
    if (cached_employees && cached_employees.length > 0) {
      // Convert Map to array before storing
      localStorage.setItem("cached_employees", JSON.stringify(cached_employees));
    }
  }, [cached_employees]);

  return (
    <cached_employees_context.Provider value={{ cached_employees, setCached_Employees }}>
      {children}
    </cached_employees_context.Provider>
  );
}

export { useCachedEmployeesContext, CachedEmployeesProvider };
