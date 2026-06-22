import styles from "./inputs.module.css"


// -------------------- Style of wrapper map --------------------

const inputsWrapperClassMap = {
  "sided_inputs": styles.sided_inputs_wrapper,
  "col_inputs": styles.colm_inputs_wrapper,
  "row_inputs": styles.row_inputs_wrapper,
  "check_inputs_wrapper" : styles.check_inputs_wrapper,
  "default": styles.colm_inputs_wrapper
};
// -------------------- Labelling Component Map --------------------

export const InputLabelMaps = {
    "labeled_input": LabeledInput,
    "normal_input": NormalInput,
}

// -------------------- Type Component Map --------------------
const InputMaps = {
    "checkbox": CheckBoxInput,
    "date": DateInput,
    "default":BasicInput,
}



// -------------------- Labelling  --------------------
function LabeledInput({inputs_info  , formKind , defaultValues , references } ){

    const wrapperClass = inputsWrapperClassMap[formKind] || inputsWrapperClassMap.default;

  return (
    <div className={wrapperClass}>
      {inputs_info && inputs_info.length > 0 && inputs_info.map((input) => {
        const InputComponent = InputMaps[input.type] || InputMaps.default;
        return (
          <div key={input.name} className={styles.txt_field}>
            <InputComponent input={input} references={references} defaultValues={defaultValues} />
            <label>{input.label}</label>
          </div>
        );
      })}
    </div>
  );
}

function NormalInput({inputs_info  , formKind , defaultValues , references } ){

    const wrapperClass = inputsWrapperClassMap[formKind] || inputsWrapperClassMap.default;

  return (
    <div className={wrapperClass}>
      {inputs_info && inputs_info.length > 0 && inputs_info.map((input) => {
        const InputComponent = InputMaps[input.type] || InputMaps.default;
        return (
          <div key={input.name} className={styles.txt_field}>
            <InputComponent input={input} references={references} defaultValues={defaultValues} />
          </div>
        );
      })}
    </div>
  );

}

// -------------------- Type Component Map --------------------
function  BasicInput({ input, references, defaultValues }) {

    return (
        <>
            <input 
                required={input.isRequired || false}
                name={input.name} 
                placeholder={input.label? input.label : "Type Here"} 
                ref={(el)=>references.current[input.name] = el} 
                type={input.type} defaultValue={defaultValues?.[input.name] ?? ""} 
            />
        </>
    )
}
function DateInput({ input, references, defaultValues }) {

    const defaultDate = defaultValues?.[input.name]
          ? defaultValues[input.name].split("T")[0] // convert ISO string to YYYY-MM-DD
          : "";

    return (
        <>
                        <input
                            required={input.isRequired || false}
                            name={input.name}
                            ref={(el) => references.current[input.name] = el}
                            type="date"
                            defaultValue={defaultDate}
                        />
        </>
    )
}


function CheckBoxInput({input , references , defaultValues  }){
    // convert perms to set for easier checking

    const permsSet = defaultValues?.emp_perms
  ? defaultValues.emp_perms
  : null;
    

    return (
        <div className={styles.check_input_wrapper}>
            {/* if employee_displayed exists then check if he had that perm by set of perms he has*/}
            <input 
                required={input.isRequired || false} 
                name={input.name}  ref={(el)=> 
                references.current[input.name]= el} 
                type={input.type} 
                defaultChecked={permsSet? permsSet.has(input.name):false } />
                <label>{input.label}</label>
        </div >
     
    )
}
