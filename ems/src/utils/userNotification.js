import {  toast } from "react-toastify";

export default function userNotification(type , message){

    switch (type) {
        case "success" :
            toast.success(message)
            break;
        case "error" :
            toast.error(message)
            break;
        case "warning" :
            toast.warning(message)
            break;
    }

}