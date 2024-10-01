

function stringifyFields(isFor , entries){
    // seperate values from fields
    switch(isFor){
        case "seperate" :
            // to return text like <field1> , <field2>  , <field3> and  <value1> , <value2> , <value3>
            let columns_field = "";
            let values_field = "";
                    entries.forEach(([key , value ],indx)=>{
                        columns_field += key;
                        if(value || value === 0){
                            values_field += `${value}`
                        }
                        if(indx !== request_entries.length - 1){
                            columns_field += ",";
                            values_field += ","
                        }
                            
                    })

                return { columns_field , values_field};

            case "anded" :
                // as field1 = value1 , field2 = value2 .....
                let joined = "";

                // adding columns to be updated as col1 = newVal , col2 = newVal ....
                entries.forEach(([key,value] , indx) => {
                    if(value || value === 0){
                        joined += `${key}=${value}`
                    }
                    if(indx !== entries.length - 1) joined += '&';
               
                })

                return joined


            case "fields" :
                // as field1 , field2 , .....
                let fields = ""
                entries.forEach(( field , indx) => {
                    fields += field;
                    if(indx !== entries.length - 1) fields += ','
                });

                return fields
    }


}



export default stringifyFields;