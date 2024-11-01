import userNotification from "./userNotification";

export default function statusNotification(statusCode){
    switch (parseInt(statusCode) ){

        case 429 :
            return userNotification("error", "Too many Requests Try Again Later");
        
        case 401 :
            return userNotification("error", "Login Again - Token Expired");
        
        case 500 :
            return userNotification("error", "Internal Server Error")

    }
}