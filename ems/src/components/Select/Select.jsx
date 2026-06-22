
export default function Select({ styles , select_options , isLabeld= true , defaultValue , reference, onChange}){
    const select_element_data =select_options

    return ( 
        <div  className={`${styles["select-wrapper"]} select-div`}>
        { isLabeld && <label className="select-label" htmlFor={select_element_data.name}>{select_element_data.label}</label>}
            
            <select onChange={onChange} key={select_element_data.name} ref={(el)=>reference.current[select_element_data.name] = el}  name={select_element_data.name} id={select_element_data.name}>
                
                { !isLabeld && <option value="" disabled selected hidden>{select_element_data.label}</option>}
            {
                select_element_data.options &&
                select_element_data.options.map((option)=>{
            
                    return (
                        <>
                        {/* we use selected to mark option as default either if defaultValue=== option.value or option is marked as selected in select_options*/}
                            <option key={option.value} value={option.value} selected={defaultValue? defaultValue === option.value :( option.selected || false)} >{option.text}</option>
                        </>
                    )
                })
            }
            </select>
        </div>
    )
}





