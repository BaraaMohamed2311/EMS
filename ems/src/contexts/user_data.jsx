"use client";
import { createContext, useContext, useState, useEffect } from "react";


const user_data_context = createContext();

const useUserDataContext = () => useContext(user_data_context);

function UserDataProvider({ children }) {

    const initial_values =  {
            emp_id: null,
            emp_name: null,
            emp_email: null,
            emp_position: null,
            emp_salary: null,
            emp_bonus: null,
            emp_abscence: null,
            emp_rate: null,
            emp_perms:[], // so do not get error when Array.from we define as [] instead of null
            role_name:null,
            token: null
        };
        
    const [user_data, setUser_Data] = useState(initial_values);

    useEffect(() => {

            const storedData = localStorage.getItem("user_data");
            if (storedData) {
                // converting perms into set before storing in context
                const {emp_perms , ...userData} = JSON.parse(storedData);
                setUser_Data({emp_perms: new Set(emp_perms) , ...userData});
            }

    }, []);

    useEffect(() => {
        if (user_data.token !== null) {
            // converting set into array before storing in local storage
            const {emp_perms , ...userData} = user_data;
            localStorage.setItem("user_data", JSON.stringify({emp_perms : emp_perms?Array.from(emp_perms) : [],...userData}));
            
        }
    }, [ user_data.token ]);

    return (
        <user_data_context.Provider value={{ user_data, setUser_Data }}>
            {children}
        </user_data_context.Provider>
    );
}

export { useUserDataContext, UserDataProvider };
