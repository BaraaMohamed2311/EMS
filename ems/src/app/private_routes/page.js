"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkToken from "@/utils/checkToken";
import { useUserDataContext } from "../../contexts/user_data";

export default function private_routes(WrappedComponent) {
  const PrivateRoute = (props) => {
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user_data } = useUserDataContext();
    const router = useRouter();

    useEffect(() => {
      if (user_data.token) {
        checkToken(user_data.token, setIsValid, setIsLoading);
      } else {
        setIsValid(false);
        setIsLoading(false);
      }
    }, [user_data.token]);

    useEffect(() => {
      if (!isLoading && !isValid) {
        router.push("/login"); // Navigate to login page
      }
    }, [isLoading, isValid]);

    if (isLoading) {
      return (
        <div className="loadingScreen">
          <div className="loader"></div>
        </div>
      );
    }

    // Only render if valid
    if (isValid) {
      return <WrappedComponent {...props} />;
    }

    // Return null to avoid flashing
    return null;
  };

  return PrivateRoute;
}
