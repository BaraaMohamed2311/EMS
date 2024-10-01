"use client";
import { createContext, useContext, useEffect, useState } from "react";

const IsLoginContext = createContext();

const useIsLoginContext = () => useContext(IsLoginContext);

function IsLoginProvider({ children }) { 
    // to fix reseting to false when refresh we stor value in local storage
    const initial = typeof window !== 'undefined' && localStorage.getItem("isLogin") ?
                                                JSON.parse(localStorage.getItem("isLogin")) : false ;
    const [isLogin, setIsLogin] = useState(initial);


   useEffect(()=>{

        localStorage.setItem("isLogin",JSON.stringify(isLogin));
        
    },[isLogin])

    return (
        <IsLoginContext.Provider value={{ isLogin, setIsLogin }}>
            {children}
        </IsLoginContext.Provider>
    );
}

export { useIsLoginContext, IsLoginProvider };
