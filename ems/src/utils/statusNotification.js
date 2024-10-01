import userNotification from "./userNotification";

export default function statusNotification(statusCode){
    switch (parseInt(statusCode) ){

        case 429 :
            return userNotification("error", "Too many Requests Try Again Later");
        
        case 401 :
            return userNotification("error", "Token Expired, LogIn");
        
        case 500 :
            return userNotification("error", "Internal Server Error")

    }
}