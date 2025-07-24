
 export default function Select({ styles , select_options , isLabeld= true , employee_displayed , reference}){
    return ( 
        <div  className={`${styles["select-wrapper"]} select-div`}>
        { isLabeld && <label className="select-label" htmlFor={select_options.name}>{select_options.label}</label>}
            
            <select key={select_options.name} ref={(el)=>reference.current[select_options.name] = el}  name={select_options.name} id={select_options.name}>
                
                { !isLabeld && <option value="" disabled selected hidden>{select_options.label}</option>}
            {
                
                select_options.options.map((option)=>{
            
                    return (
                        <>
                        {/* if employee_displayed exist then make the selected same as user previous by checking that it's equal to option and if employee_displayed not exist just check option.selected from data.js*/}
                            <option key={option.value} value={option.value} selected={employee_displayed ?(employee_displayed[select_options.name] === option.value ):( option.selected || false)}>{option.text}</option>
                        </>
                    )
                })
            }
            </select>
        </div>
    )
}





