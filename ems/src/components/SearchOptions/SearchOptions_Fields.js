// filters/userFilters.js
import Select from "@/components/Select/Select";
import Inputs from "../Inputs/Inputs";
function renderUserFilters({ styles, references ,fieldDefinitions}) {

  let {inputs_info, select_def} =fieldDefinitions;
  let {inputsBoxsRef , selectBoxsRef} = references;
  return (
    <>{inputs_info && 
       <Inputs
        styles={styles}
        inputs_info={inputs_info}
        type="normal_input"
        references={inputsBoxsRef}

        formKind={"row_inputs"}
      />}
      {select_def &&
        select_def.map((selectData) => (
          <Select
            key={selectData.name}
            styles={styles}
            isLabeld={false}
            select_options={selectData}
            reference={selectBoxsRef}
          />
        ))}
    </>
  );
}




 function renderRoomFilters({ styles, references ,other_btns_actions , fieldDefinitions}) {

  let {select_def} =fieldDefinitions;
  let {selectBoxsRef} = references;
  return (
    <>

      {select_def &&
        select_def.map((selectData) => (
          <Select
            key={selectData.name}
            styles={styles}
            isLabeld={false}
            select_options={selectData}
            reference={selectBoxsRef}
          />
        ))}
        {/* New buttons for occupied and empty rooms */}

        <button
          type="button"
          className={`${styles["filter"]} ${styles["occupied-btn"]}`}
          onClick={(e) => other_btns_actions.handleShowAllOccupiedRooms(e)}
        >
          Show All Occupied
        </button>

        <button
          type="button"
          className={`${styles["filter"]} ${styles["empty-btn"]}`}
          onClick={(e) => other_btns_actions.handleShowAllEmptyRooms(e)}
        >
          Show All Empty
        </button>
    
    </>
  );
}


function renderPatientFilters({ styles, references,fieldDefinitions }) {
  let {inputs_info} =fieldDefinitions;
  let {inputsBoxsRef} = references;
  return (
    <>
      {inputs_info && 
       <Inputs
        styles={styles}
        inputs_info={inputs_info}
        type="normal_input"
        references={inputsBoxsRef}
        formKind={"row_inputs"}
      />}
    </>
  );
}


const MapToSearchOptionFields ={
    "users":renderUserFilters,
    "rooms":renderRoomFilters,
    "patients":renderPatientFilters
}

export {MapToSearchOptionFields}

