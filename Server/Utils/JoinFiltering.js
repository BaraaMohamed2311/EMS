function JoinFiltering(entries , db){
    // as field1 = value1 , field2 = value2 .....
    let anded = "";
    // adding columns to be updated as col1 = newVal , col2 = newVal ....
    entries.forEach(([key,value] , indx) => {
        // if there is a value we execute
        if(value && value !== 'null'){
            if(typeof value == 'string'){
                anded += `${db}.${key} = "${value}"`
            }else{
                anded += `${key} = ${value}`
            }
            if(indx !== entries.length - 1) anded += ' AND ';
        }
        

    })

    return  anded ;
}


module.exports = JoinFiltering;