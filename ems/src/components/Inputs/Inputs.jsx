import styles from "./inputs.module.css"; 
// default value for type is regular input

function CheckBoxInput({inputs_info , references , employee_displayed }){
    // convert perms to set for easier checking
    const employee_permsSet = employee_displayed? new Set(employee_displayed.emp_perms.split(", ")) : "";
    
    return (
        <div className={styles.check_inputs_wrapper}>
                {
                    inputs_info && inputs_info.map((input,indx)=>{
                        return (
                            <div key={input.name} className={styles.check_input_wrapper }>
                                {/* if employee_displayed exists then check if he had that perm by set of perms he has*/}
                                <input required={input.isRequired || false} name={input.name}  ref={(el)=> references.current[input.name]= el} type={input.type} defaultChecked={employee_permsSet? employee_permsSet.has(input.name):false } />
                                <span></span>
                                <label>{input.label}</label>
                            </div>
                        )
                    })
                }
            </div> 
    )
}

function RegularInput({inputs_info  , formKind , employee_displayed , references} ){
    return (
        <div className={formKind === "update_form"   ? styles.sided_inputs_wrapper : styles.colm_inputs_wrapper}>
            
                {
                    
                    inputs_info && inputs_info.map((input,indx)=>{
                        return (
                            <div key={input.name} className={styles.txt_field }>
                                {/* if input is checkbox then add value attribute with same Value as Name*/}
                                <input required={input.isRequired || false} name={input.name}  ref={(el)=>references.current[input.name] = el} type={input.type} defaultValue={employee_displayed ? employee_displayed[input.name]:""} />
                                <span></span>
                                <label>{input.label}</label>
                            </div>
                        )
                    })
                }
            </div>
    )
}

const InputMaps = {
    "checkbox": CheckBoxInput,
    "input": RegularInput,
}

 export default function Inputs({inputs_info ,type , formKind , employee_displayed , references }){
    
    const InputComponent = InputMaps[type] || RegularInput; // Default to RegularInput if type is not found
    return ( 
        <InputComponent inputs_info={inputs_info} formKind={formKind}  employee_displayed={employee_displayed}  references ={references }></InputComponent>
        
    )
}