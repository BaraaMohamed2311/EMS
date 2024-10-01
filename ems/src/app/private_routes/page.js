"use client"
import { useEffect, useState } from "react";
import checkToken from "@/utils/checkToken";
import { useUserDataContext } from "../../contexts/user_data";
import LoginPage from "../login/page";

export default function private_routes(WrappedComponent) {
  return (props) => {
    const [isValid, setIsValid] = useState(false); // For handling initial loading state
    const [isLoading, setIsLoading] = useState(true); // by default show loader till checking ends
    const { user_data } = useUserDataContext();

    useEffect( () => {
      if (user_data.token) {
        // Validate the token
        checkToken(user_data.token, setIsValid ,setIsLoading)
      } 
    }, [user_data.token]);

// we display page loader with golbal styles from global.css until isValid state resolved
    if(isLoading){
      return (
        <div className="loadingScreen">
          <div className="loader"></div>
        </div>
      )
    }


    // Handle the result of the token validation
    if (isValid) {
      return <WrappedComponent {...props} />;
    } else {
      return <LoginPage />;
    }
  };
}
