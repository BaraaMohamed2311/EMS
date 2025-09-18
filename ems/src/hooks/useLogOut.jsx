"use client"
import { useUserDataContext } from "@/contexts/user_data"
import { useCachedEmployeesContext } from "@/contexts/cached_employees";
import userNotification from "../utils/userNotification";
import { useIsLoginContext } from "@/contexts/isLogin";
import { useRouter } from "next/navigation";
export default function  useLogOut(){
    let { setUser_Data } = useUserDataContext();
    let {  setCached_Employees } = useCachedEmployeesContext()
    let {setIsLogin} = useIsLoginContext()
    const router = useRouter()
    return function (){

        router.replace("/")
        setUser_Data({
            emp_id: null,
            emp_name: null,
            emp_email: null,
            emp_title: null,
            emp_specialty: null,
            emp_salary: null,
            emp_bonus: null,
            emp_abscence: null,
            emp_rate: null,
            token: null
        })

        // hide logout button
        setIsLogin(false)
        // clear user cached employee context 
        setCached_Employees([]);
        // clear all data in localStorage
        localStorage.clear();
        // send notification
        userNotification("success","Loggedout Successfully")
    }

    
}