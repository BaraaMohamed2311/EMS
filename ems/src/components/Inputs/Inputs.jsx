import {InputLabelMaps} from "./Inputs_Fields"




 export default function Inputs({inputs_info ,label_type , formKind , defaultValues = {} , references }){

    const InputComponent = InputLabelMaps[label_type] || InputLabelMaps["normal_input"]; // Default to RegularInput if type is not found


    return ( 
        <InputComponent inputs_info={inputs_info} formKind={formKind}  defaultValues={defaultValues}  references ={references }></InputComponent>
        
    )
}