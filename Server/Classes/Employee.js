const User = require("./User")

class employee extends User {
    #priority = 10; 


    getPriority(){
        return this.#priority
    }

}



module.exports = employee;