const User = require("./User")

class employee extends User {
    #priority = 10; // we are going to use priority to check that user is editing people with lower or equal priority
    constructor({emp_id,emp_email,emp_name,emp_role , emp_salary , emp_abscence , emp_bonus , emp_rate , emp_position , emp_password}){
        super(
            emp_id,emp_email,
            emp_name,
            emp_role , 
            emp_salary , 
            emp_abscence , 
            emp_bonus , 
            emp_rate , 
            emp_position , 
            emp_password);
        
    }

    getPriority(){
        return this.#priority
    }

}



module.exports = employee;