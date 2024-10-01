function fixedFields(userData){
    
    let ArrayUserData= Object.entries(userData);
    ArrayUserData = ArrayUserData.filter(([key , val])=>{
        return (key !== "emp_salary") && (key !== "emp_bonus") && (key !== "emp_absence") && (key !== "emp_rate")
    })

    return Object.fromEntries(ArrayUserData)

}

module.exports = fixedFields;