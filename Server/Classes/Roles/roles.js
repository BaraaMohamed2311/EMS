class roles {
    // because no need to create instances we make them static and access through class
    static roles = new Map([["SuperAdmin",100],["Admin",50],["NormalUser",0]]);
    
    static getRolePriority(userRole){
 
        if(this.roles.has(userRole)){
            return this.roles.get(userRole)
        }
        else{
            console.error("This Role Does Not Exist in roles Class");
            return null ;
        }
    }

}


module.exports =  roles // export an instance
