// EmployeesTableColumns.jsx
import styles from "./table.module.css";

// Separate Button Components
const VisitButton = ({ row, handleActionBtn }) => (
  <button onClick={() => handleActionBtn(row)} className={styles["grey-button"]}>
    Visit
  </button>
);

const SelectUserButton = ({ row, handleActionBtn }) => (
  <button onClick={() => handleActionBtn(row)} className={styles["blue-button"]}>
    Select
  </button>
);

// Button Components Map
const ButtonComponents = {
  "visit": VisitButton,
  "select": SelectUserButton,

};



function EmployeesTableColumns({ type, isSmallScreen, row, handleActionBtn, buttonType }) {

  const ActionButton = ButtonComponents[buttonType] || ButtonComponents["visit"];  

  if (type === "headers") {
    return (
        <>
          <th className={styles.table_col_1}>INDX</th>
          <th className={styles.table_col_1}>Name</th>
          <th className={styles.table_col_2}>Email</th>
          <th className={styles.table_col_1}>Title</th>
          <th className={styles.table_col_2}>Speciality</th>
          {!isSmallScreen && (
            <>
              <th className={styles.table_col_2}>Phone</th>
              <th className={styles.table_col_1}>Abscence</th>
            </>
          )}
          <th className={styles.table_col_1}>Details</th>
        </>
    );
  }

  // For row rendering
  return (
    <>
      <td className={styles.table_col_1}>{row.indx}</td>
      <td className={styles.table_col_1}>{row.user_name}</td>
      <td className={styles.table_col_2}>{row.user_email}</td>
      <td className={styles.table_col_1}>{row.emp_title}</td>
      <td className={styles.table_col_2}>{row.emp_specialty}</td>

      {!isSmallScreen && (
        <>
          <td className={styles.table_col_2}>{row.emp_phone || "N/A"}</td>
          <td className={styles.table_col_1}>{row.emp_abscence || "N/A"}</td>

        </>
      )}
      <td className={styles.table_col_1}>
        <ActionButton  handleActionBtn={handleActionBtn} />
      </td>
    </>)
}



function RegisteredApproveTableColumns({ type, isSmallScreen, row, otherActionBtns }) {


  if (type === "headers") {
    return (
        <>
          <th className={styles.table_col_1}>INDX</th>
          <th className={styles.table_col_1}>Name</th>
          <th className={styles.table_col_2}>Email</th>
          <th className={styles.table_col_1}>Title</th>
          <th className={styles.table_col_2}>Speciality</th>

           
              <th className={styles.table_col_2}>Accept</th>
              <th className={styles.table_col_1}>Decline</th>
            


        </>
    );
  }

  // For row rendering
  return (
    <>
      <td className={styles.table_col_1}>{row.indx}</td>
      <td className={styles.table_col_1}>{row.user_name}</td>
      <td className={styles.table_col_2}>{row.user_email}</td>
      <td className={styles.table_col_1}>{row.emp_title}</td>
      <td className={styles.table_col_2}>{row.emp_specialty}</td>





        
          <td className={styles.table_col_2}>
                  <button
                    onClick={(e) => otherActionBtns.acceptBtn(e, row)}
                    className="green-button"
                  >
                    Accept
                  </button>
                  </td>
          <td className={styles.table_col_1}>
            <button
              onClick={(e) => otherActionBtns.declineBtn(e, row)}
              className="red-button"
            >
              Decline
            </button>
          </td>

        
    </>)
}

function MapTableColumns({ tableType,type, isSmallScreen, row, handleActionBtn, buttonType , otherActionBtns  }) {

  
  // Check if target component exists
  const TargetedFieldsComponent = TableColumnsMap[tableType];
  
  if (!TargetedFieldsComponent) {
    return <p>No Targeted Table</p>;
  }
  

  // For row rendering
  return <TargetedFieldsComponent row={row} type={type} isSmallScreen={isSmallScreen} handleActionBtn={handleActionBtn} buttonType={buttonType} otherActionBtns ={otherActionBtns}/>;
}


const TableColumnsMap = {
  "employees": EmployeesTableColumns,
  "registered-approve": RegisteredApproveTableColumns,
};

export {TableColumnsMap ,MapTableColumns}
